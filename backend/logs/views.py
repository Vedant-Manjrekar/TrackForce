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
            
        if role == 'TEAM_LEAD':
            from django.db.models import Q
            from users.models import Team
            led_teams = Team.objects.filter(lead=user)
            q = Q(actor__profile__team__in=led_teams) | Q(actor=user)
            if user.profile.team:
                q = q | Q(actor__profile__team=user.profile.team)
            return ActivityLog.objects.filter(q).distinct().order_by('-timestamp')
            
        if role == 'REGIONAL_MANAGER':
            return ActivityLog.objects.filter(actor__profile__region=user.profile.region).order_by('-timestamp')
            
        return ActivityLog.objects.filter(actor=user).order_by('-timestamp')
