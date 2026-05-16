from rest_framework import viewsets, permissions as drf_permissions, status
from rest_framework.response import Response
from .models import Visit
from .serializers import VisitSerializer
from tasks.models import Task
from logs.models import ActivityLog
from ai_services.mock_ai_service import MockAIService
from django.utils import timezone

from permissions.permissions import RoleBasedAccess

class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [drf_permissions.IsAuthenticated, RoleBasedAccess]
    filterset_fields = ['task', 'agent', 'status']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD', 'FIELD_AGENT', 'AUDITOR']
        elif self.action in ['create', 'update', 'partial_update']:
            self.allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD', 'FIELD_AGENT']
        elif self.action == 'destroy':
            self.allowed_roles = ['ADMIN', 'REGIONAL_MANAGER']
        else:
            self.allowed_roles = []
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            return Visit.objects.none()
            
        role = user.profile.role.name
        
        if role == 'ADMIN' or role == 'AUDITOR':
            return Visit.objects.all()
        
        if role == 'REGIONAL_MANAGER':
            return Visit.objects.filter(task__region=user.profile.region)
            
        if role == 'TEAM_LEAD':
            return Visit.objects.filter(task__team=user.profile.team)
            
        if role == 'FIELD_AGENT':
            return Visit.objects.filter(agent=user)
            
        return Visit.objects.none()

    def perform_create(self, serializer):
        visit = serializer.save(agent=self.request.user, status='STARTED')
        from logs.utils import log_activity
        log_activity(
            self.request.user, 
            'VISIT_STARTED', 
            'Visit', 
            visit.id, 
            {'task_title': visit.task.title}
        )

    def perform_update(self, serializer):
        instance = self.get_object()
        was_completed = instance.status == 'COMPLETED'
        
        # If notes are updated or status changed to completed, trigger AI
        notes = serializer.validated_data.get('notes', instance.notes)
        new_status = serializer.validated_data.get('status', instance.status)
        
        ai_data = {}
        if notes and (instance.notes != notes or (new_status == 'COMPLETED' and not was_completed)):
            ai_data = MockAIService.generate_visit_insights(notes)
        
        visit = serializer.save(
            ai_summary=ai_data.get('summary', instance.ai_summary),
            ai_recommendation=ai_data.get('recommendation', instance.ai_recommendation),
            ai_risk_flag=ai_data.get('risk_flag', instance.ai_risk_flag),
            end_time=timezone.now() if new_status == 'COMPLETED' and not was_completed else instance.end_time
        )
        
        if new_status == 'COMPLETED' and not was_completed:
            from logs.utils import log_activity
            log_activity(
                self.request.user, 
                'VISIT_COMPLETED', 
                'Visit', 
                visit.id, 
                {'task_title': visit.task.title}
            )
            # Update task status to COMPLETED if all visits are done? 
            # For simplicity, just update the task status manually or via this.
            visit.task.status = 'COMPLETED'
            visit.task.save()
