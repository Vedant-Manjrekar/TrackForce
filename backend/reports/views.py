from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions as drf_permissions
from tasks.models import Task
from visits.models import Visit
from users.models import Region, Team, User
from django.db.models import Count, Avg, F
from django.utils import timezone
from datetime import timedelta

from permissions.permissions import RoleBasedAccess

class ReportSummaryView(APIView):
    permission_classes = [drf_permissions.IsAuthenticated, RoleBasedAccess]
    allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD', 'AUDITOR']

    def get(self, request):
        user = request.user
        role = user.profile.role.name
        
        tasks_qs = Task.objects.all()
        visits_qs = Visit.objects.all()
        
        if role == 'REGIONAL_MANAGER':
            tasks_qs = tasks_qs.filter(region=user.profile.region)
            visits_qs = visits_qs.filter(task__region=user.profile.region)
        elif role == 'TEAM_LEAD':
            tasks_qs = tasks_qs.filter(team=user.profile.team)
            visits_qs = visits_qs.filter(task__team=user.profile.team)
        # Auditor and Admin see all

        # 1. Pending tasks by region (Includes PENDING, ASSIGNED, IN_PROGRESS)
        pending_tasks = tasks_qs.filter(status__in=['PENDING', 'ASSIGNED', 'IN_PROGRESS']).select_related('region', 'assigned_to', 'team')
        pending_by_region_dict = {}
        for task in pending_tasks:
            r_name = task.region.name if task.region else 'Unassigned Region'
            if r_name not in pending_by_region_dict:
                pending_by_region_dict[r_name] = {'region__name': r_name, 'count': 0, 'tasks': []}
            pending_by_region_dict[r_name]['count'] += 1
            pending_by_region_dict[r_name]['tasks'].append({
                'id': task.id,
                'title': task.title,
                'priority': task.priority,
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'assigned_to': task.assigned_to.username if task.assigned_to else 'Unassigned',
                'team': task.team.name if task.team else 'No Team'
            })
        pending_tasks_by_region = list(pending_by_region_dict.values())
        
        # 2. Average completion time per field agent (Calculated in Python for 100% SQLite & DB compatibility)
        completed_visits = visits_qs.filter(status='COMPLETED').select_related('agent')
        agent_durations = {}
        for v in completed_visits:
            if v.agent and v.start_time and v.end_time:
                username = v.agent.username
                dur_minutes = (v.end_time - v.start_time).total_seconds() / 60.0
                if username not in agent_durations:
                    agent_durations[username] = []
                agent_durations[username].append(dur_minutes)
                
        avg_completion_time = []
        for username, durations in agent_durations.items():
            avg_completion_time.append({
                'agent__username': username,
                'avg_duration_minutes': sum(durations) / len(durations)
            })

        # 3. Visits completed in last 7 days
        seven_days_ago = timezone.now() - timedelta(days=7)
        visits_last_7_days = visits_qs.filter(status='COMPLETED', end_time__gte=seven_days_ago).count()

        # 4. Task distribution by status
        task_distribution = tasks_qs.values('status').annotate(count=Count('id'))

        return Response({
            'pending_tasks_by_region': list(pending_tasks_by_region),
            'avg_completion_time_per_agent': list(avg_completion_time),
            'visits_completed_last_7_days': visits_last_7_days,
            'task_distribution': list(task_distribution)
        })

class DashboardSummaryView(APIView):
    permission_classes = [drf_permissions.IsAuthenticated, RoleBasedAccess]
    allowed_roles = ['ADMIN', 'REGIONAL_MANAGER', 'TEAM_LEAD', 'FIELD_AGENT', 'AUDITOR']

    def get(self, request):
        user = request.user
        role = user.profile.role.name
        
        # Basic counts based on scope
        tasks = Task.objects.all()
        visits = Visit.objects.all()
        
        if role == 'REGIONAL_MANAGER':
            tasks = tasks.filter(region=user.profile.region)
            visits = visits.filter(task__region=user.profile.region)
        elif role == 'TEAM_LEAD':
            tasks = tasks.filter(team=user.profile.team)
            visits = visits.filter(task__team=user.profile.team)
        elif role == 'FIELD_AGENT':
            tasks = tasks.filter(assigned_to=user)
            visits = visits.filter(agent=user)

        from logs.models import ActivityLog
        recent_logs = ActivityLog.objects.order_by('-timestamp')
        if role == 'FIELD_AGENT':
            recent_logs = recent_logs.filter(actor=user)
        elif role == 'TEAM_LEAD':
            recent_logs = recent_logs.filter(actor__profile__team=user.profile.team)
        elif role == 'REGIONAL_MANAGER':
            recent_logs = recent_logs.filter(actor__profile__region=user.profile.region)

        return Response({
            'total_tasks': tasks.count(),
            'pending_tasks': tasks.filter(status__in=['PENDING', 'ASSIGNED', 'IN_PROGRESS']).count(),
            'completed_tasks': tasks.filter(status='COMPLETED').count(),
            'active_visits': visits.filter(status='STARTED').count(),
            'completed_visits': visits.filter(status='COMPLETED').count(),
            'total_users': User.objects.count(),
            'active_agents': User.objects.filter(profile__role__name='FIELD_AGENT', is_active=True).count(),
            'high_risk_visits': visits.filter(ai_risk_flag='HIGH').count(),
            'todays_visits': visits.filter(start_time__date=timezone.now().date()).count(),
            'recent_activities': recent_logs[:10].values(
                'id', 'actor__username', 'action', 'details', 'timestamp'
            ),
            'task_distribution': list(tasks.values('status').annotate(count=Count('id'))),
            'region_performance': list(tasks.values('region__name').annotate(count=Count('id'))),
            'visits_per_day': list(visits.filter(start_time__gte=timezone.now()-timedelta(days=7))
                                 .extra(select={'day': "date(start_time)"})
                                 .values('day')
                                 .annotate(count=Count('id'))
                                 .order_by('day'))
        })
