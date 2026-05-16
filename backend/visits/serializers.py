from rest_framework import serializers
from .models import Visit
from tasks.serializers import TaskSerializer

class VisitSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.username', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)

    class Meta:
        model = Visit
        fields = '__all__'
        read_only_fields = ['agent', 'start_time', 'ai_summary', 'ai_recommendation', 'ai_risk_flag']
