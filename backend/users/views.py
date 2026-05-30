from rest_framework import viewsets, permissions as drf_permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Role, Region, Team, EmployeeProfile
from .serializers import UserSerializer, RoleSerializer, RegionSerializer, TeamSerializer, EmployeeProfileSerializer, UserSignupSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not hasattr(user, 'profile'):
            return User.objects.none()
            
        role = user.profile.role.name
        
        if role == 'ADMIN' or role == 'AUDITOR':
            return User.objects.all().order_by('-id')
            
        if role == 'REGIONAL_MANAGER':
            return User.objects.filter(profile__region=user.profile.region).order_by('-id')
            
        if role == 'TEAM_LEAD':
            if user.profile.team:
                return User.objects.filter(profile__team=user.profile.team).order_by('-id')
            return User.objects.filter(id=user.id).order_by('-id')
            
        if role == 'FIELD_AGENT':
            return User.objects.filter(id=user.id)
            
        return User.objects.none()

    def get_permissions(self):
        if self.action == 'register':
            return [drf_permissions.AllowAny()]
        
        from permissions.permissions import RoleBasedAccess
        if self.action == 'list':
            self.allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD']
        else:
            self.allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD', 'FIELD_AGENT', 'AUDITOR']
            
        return [drf_permissions.IsAuthenticated(), RoleBasedAccess()]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')
        if not new_password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset successfully"})

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    pagination_class = None

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all().order_by('-id')
    serializer_class = RegionSerializer
    permission_classes = [drf_permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not hasattr(user, 'profile'):
            return Region.objects.all().order_by('-id')
            
        role = user.profile.role.name
        
        if role == 'ADMIN' or role == 'AUDITOR':
            return Region.objects.all().order_by('-id')
            
        if role in ['REGIONAL_MANAGER', 'TEAM_LEAD', 'FIELD_AGENT']:
            if user.profile.region:
                return Region.objects.filter(id=user.profile.region.id).order_by('-id')
            return Region.objects.none()
            
        return Region.objects.none()

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('-id')
    serializer_class = TeamSerializer
    permission_classes = [drf_permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not hasattr(user, 'profile'):
            return Team.objects.all().order_by('-id')
            
        role = user.profile.role.name
        
        if role == 'ADMIN' or role == 'AUDITOR':
            return Team.objects.all().order_by('-id')
            
        if role == 'REGIONAL_MANAGER':
            return Team.objects.filter(region=user.profile.region).order_by('-id')
            
        if role == 'TEAM_LEAD':
            led_teams = Team.objects.filter(lead=user)
            if led_teams.exists():
                return Team.objects.filter(id__in=led_teams).order_by('-id')
            return Team.objects.none()
            
        if role == 'FIELD_AGENT':
            if user.profile.team:
                return Team.objects.filter(id=user.profile.team.id).order_by('-id')
            return Team.objects.none()
            
        return Team.objects.none()
