from rest_framework import viewsets, permissions as drf_permissions, status
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
from logs.models import ActivityLog
from django.db.models import Q

from permissions.permissions import RoleBasedAccess, IsAdmin, IsRegionalManager, IsTeamLead, IsFieldAgent, IsAuditor

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [drf_permissions.IsAuthenticated, RoleBasedAccess]
    
    filterset_fields = ['status', 'priority', 'region', 'team', 'assigned_to']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'created_at', 'priority']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD', 'FIELD_AGENT', 'AUDITOR']
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD']
        else:
            self.allowed_roles = []
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            return Task.objects.none()
            
        role = user.profile.role.name
        
        if role == 'ADMIN' or role == 'AUDITOR':
            return Task.objects.all()
        
        if role == 'REGIONAL_MANAGER':
            return Task.objects.filter(region=user.profile.region)
            
        if role == 'TEAM_LEAD':
            return Task.objects.filter(Q(team=user.profile.team) | Q(assigned_to__profile__role__name='FIELD_AGENT')).distinct()
            
        if role == 'FIELD_AGENT':
            return Task.objects.filter(assigned_to=user)
            
        return Task.objects.none()

    def perform_create(self, serializer):
        task = serializer.save(created_by=self.request.user)
        from logs.utils import log_activity
        log_activity(
            self.request.user, 
            'TASK_CREATED', 
            'Task', 
            task.id, 
            {'title': task.title}
        )
        if task.assigned_to:
            log_activity(
                self.request.user, 
                'TASK_ASSIGNED', 
                'Task', 
                task.id, 
                {'assignee': task.assigned_to.username}
            )

    def perform_update(self, serializer):
        old_status = self.get_object().status
        task = serializer.save()
        if old_status != task.status:
            from logs.utils import log_activity
            log_activity(
                self.request.user, 
                'STATUS_CHANGED', 
                'Task', 
                task.id, 
                {'old_status': old_status, 'new_status': task.status}
            )
        
        if 'assigned_to' in serializer.validated_data:
            ActivityLog.objects.create(
                actor=self.request.user,
                action='TASK_ASSIGNED',
                target_type='Task',
                target_id=task.id,
                details={'assigned_to': task.assigned_to.username if task.assigned_to else 'None'}
            )
