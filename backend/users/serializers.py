from rest_framework import serializers
from .models import User, EmployeeProfile, Role, Region, Team
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['role'] = user.profile.role.name if hasattr(user, 'profile') else None
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    teams = serializers.StringRelatedField(many=True, read_only=True)
    managers = serializers.SerializerMethodField()
    task_count = serializers.SerializerMethodField()
    agent_count = serializers.SerializerMethodField()

    class Meta:
        model = Region
        fields = ['id', 'name', 'teams', 'managers', 'task_count', 'agent_count']

    def get_managers(self, obj):
        return [u.username for u in User.objects.filter(profile__region=obj, profile__role__name='REGIONAL_MANAGER')]

    def get_task_count(self, obj):
        from tasks.models import Task
        return Task.objects.filter(region=obj).count()

    def get_agent_count(self, obj):
        return User.objects.filter(profile__region=obj, profile__role__name='FIELD_AGENT').count()

class TeamSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    lead_name = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    performance_stats = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'region', 'region_name', 'lead_name', 'members', 'performance_stats']

    def get_lead_name(self, obj):
        lead = User.objects.filter(profile__team=obj, profile__role__name='TEAM_LEAD').first()
        return lead.username if lead else "Unassigned"

    def get_members(self, obj):
        return [u.username for u in User.objects.filter(profile__team=obj, profile__role__name='FIELD_AGENT')]

    def get_performance_stats(self, obj):
        from tasks.models import Task
        from visits.models import Visit
        total_tasks = Task.objects.filter(team=obj).count()
        completed_tasks = Task.objects.filter(team=obj, status='COMPLETED').count()
        return {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'completion_rate': f"{(completed_tasks/total_tasks*100) if total_tasks > 0 else 0:.1f}%",
            'active_visits': Visit.objects.filter(task__team=obj, status='STARTED').count()
        }

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role.name', read_only=True)
    region = serializers.CharField(source='profile.region.name', read_only=True, allow_null=True)
    team = serializers.CharField(source='profile.team.name', read_only=True, allow_null=True)
    team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='profile.team', required=False, allow_null=True)
    stats = serializers.SerializerMethodField()
    
    # Write-only fields for updates
    role_name = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    region_id = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), source='profile.region', write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'region', 'team', 'team_id', 'is_active', 'stats', 'role_name', 'region_id']

    def get_stats(self, obj):
        if not hasattr(obj, 'profile') or obj.profile.role.name != 'FIELD_AGENT':
            return None
        
        from tasks.models import Task
        tasks = Task.objects.filter(assigned_to=obj)
        total = tasks.count()
        completed = tasks.filter(status='COMPLETED').count()
        return {
            'total_tasks': total,
            'completed_tasks': completed,
            'completion_rate': round((completed / total * 100), 1) if total > 0 else 0
        }

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        role_name = validated_data.pop('role_name', None)
        
        # Update User fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update Profile fields
        if not hasattr(instance, 'profile'):
            role, _ = Role.objects.get_or_create(name=role_name or 'FIELD_AGENT')
            import uuid
            emp_id = f"EMP-{uuid.uuid4().hex[:8].upper()}"
            profile = EmployeeProfile.objects.create(
                user=instance,
                role=role,
                employee_id=emp_id
            )
        else:
            profile = instance.profile

        if role_name:
            role, _ = Role.objects.get_or_create(name=role_name)
            profile.role = role
        
        if 'region' in profile_data:
            profile.region = profile_data['region']
        if 'team' in profile_data:
            profile.team = profile_data['team']
            
        profile.save()
        return instance

class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = EmployeeProfile
        fields = '__all__'

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=False)
    full_name = serializers.CharField(write_only=True)
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), required=False, allow_null=True)
    region_id = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), source='region', write_only=True, required=False, allow_null=True)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), required=False, allow_null=True)
    team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='team', write_only=True, required=False, allow_null=True)
    role = serializers.CharField(required=False, default='FIELD_AGENT')
    role_name = serializers.CharField(source='role', write_only=True, required=False, default='FIELD_AGENT')

    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'password', 'confirm_password', 'role', 'role_name', 'region', 'region_id', 'team', 'team_id']

    def validate(self, data):
        pwd = data.get('password')
        confirm_pwd = data.get('confirm_password', pwd)
        if pwd != confirm_pwd:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        # Prevent self-registering as ADMIN
        if data.get('role') == 'ADMIN':
            data['role'] = 'FIELD_AGENT' # Force default if they try to be admin
            
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        full_name = validated_data.pop('full_name')
        region = validated_data.pop('region', None)
        team = validated_data.pop('team', None)
        role_name = validated_data.pop('role', 'FIELD_AGENT')
        
        # Split name
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        # Create profile
        role, _ = Role.objects.get_or_create(name=role_name)
        
        # Generate a unique employee_id
        import uuid
        emp_id = f"EMP-{uuid.uuid4().hex[:8].upper()}"
        
        EmployeeProfile.objects.create(
            user=user,
            role=role,
            region=region,
            team=team,
            employee_id=emp_id
        )
        
        return user
