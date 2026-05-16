from rest_framework import serializers
from .models import Task
from users.serializers import UserSerializer

class TaskSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    region_name = serializers.CharField(source='region.name', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']
