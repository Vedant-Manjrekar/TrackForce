from rest_framework import viewsets, permissions as drf_permissions
from .models import ActivityLog
from .serializers import ActivityLogSerializer

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().order_by('-timestamp')
    serializer_class = ActivityLogSerializer

    def get_queryset(self):
        user = self.request.user
        role = user.profile.role.name
        
        if role == 'ADMIN' or role == 'AUDITOR':
            return ActivityLog.objects.all().order_by('-timestamp')
            
        # For others, maybe they only see their own logs or logs related to their scope?
        # Requirement says Auditor has access to reports and logs.
        # Admin has full access.
        # Let's restrict others to their own actions for now, or just follow the requirement.
        
        return ActivityLog.objects.filter(actor=user).order_by('-timestamp')
