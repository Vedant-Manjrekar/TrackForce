from django.test import TestCase
from django.contrib.auth import get_user_model
from users.models import Role, Region, Team, EmployeeProfile
from tasks.models import Task
from visits.models import Visit
from logs.models import ActivityLog
from reports.views import ReportSummaryView, DashboardSummaryView
from rest_framework.test import APIRequestFactory, force_authenticate
from users.views import UserViewSet, RegionViewSet, TeamViewSet
from tasks.views import TaskViewSet
from visits.views import VisitViewSet
from logs.views import ActivityLogViewSet
from users.serializers import UserSerializer, UserSignupSerializer, TeamSerializer
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class TeamLeadLogicTestCase(TestCase):
    def setUp(self):
        # Create Roles
        self.role_admin = Role.objects.create(name='ADMIN')
        self.role_rm = Role.objects.create(name='REGIONAL_MANAGER')
        self.role_tl = Role.objects.create(name='TEAM_LEAD')
        self.role_agent = Role.objects.create(name='FIELD_AGENT')

        # Create Region
        self.region_north = Region.objects.create(name='North')
        self.region_south = Region.objects.create(name='South')

        # Create Teams
        self.team_alpha = Team.objects.create(name='Team Alpha', region=self.region_north)
        self.team_beta = Team.objects.create(name='Team Beta', region=self.region_north)
        self.team_gamma = Team.objects.create(name='Team Gamma', region=self.region_south)

        # Create Users
        self.admin = User.objects.create_user(username='admin_user', email='admin@test.com', password='password')
        EmployeeProfile.objects.create(user=self.admin, role=self.role_admin, employee_id='EMP_ADMIN')

        self.rm = User.objects.create_user(username='rm_user', email='rm@test.com', password='password')
        EmployeeProfile.objects.create(user=self.rm, role=self.role_rm, region=self.region_north, employee_id='EMP_RM')

        self.tl_alpha = User.objects.create_user(username='tl_alpha', email='tla@test.com', password='password')
        EmployeeProfile.objects.create(user=self.tl_alpha, role=self.role_tl, region=self.region_north, team=self.team_alpha, employee_id='EMP_TLA')
        self.team_alpha.lead = self.tl_alpha
        self.team_alpha.save()

        self.agent_alpha = User.objects.create_user(username='agent_alpha', email='aa@test.com', password='password')
        EmployeeProfile.objects.create(user=self.agent_alpha, role=self.role_agent, region=self.region_north, team=self.team_alpha, employee_id='EMP_AA')

        self.agent_beta = User.objects.create_user(username='agent_beta', email='ab@test.com', password='password')
        EmployeeProfile.objects.create(user=self.agent_beta, role=self.role_agent, region=self.region_north, team=self.team_beta, employee_id='EMP_AB')

        # Create Tasks
        self.task_alpha = Task.objects.create(
            title='Task Alpha',
            description='Test Task Alpha',
            created_by=self.tl_alpha,
            assigned_to=self.agent_alpha,
            region=self.region_north,
            team=self.team_alpha,
            status='ASSIGNED',
            due_date=timezone.now() + timedelta(days=2)
        )
        self.task_beta = Task.objects.create(
            title='Task Beta',
            description='Test Task Beta',
            created_by=self.admin,
            assigned_to=self.agent_beta,
            region=self.region_north,
            team=self.team_beta,
            status='ASSIGNED',
            due_date=timezone.now() + timedelta(days=2)
        )

        # Create Visits
        self.visit_alpha = Visit.objects.create(
            task=self.task_alpha,
            agent=self.agent_alpha,
            status='STARTED',
            start_time=timezone.now()
        )
        self.visit_beta = Visit.objects.create(
            task=self.task_beta,
            agent=self.agent_beta,
            status='STARTED',
            start_time=timezone.now()
        )

        # Create Activity Logs
        self.log_alpha = ActivityLog.objects.create(
            actor=self.agent_alpha,
            action='VISIT_STARTED',
            target_type='Visit',
            target_id=self.visit_alpha.id
        )
        self.log_beta = ActivityLog.objects.create(
            actor=self.agent_beta,
            action='VISIT_STARTED',
            target_type='Visit',
            target_id=self.visit_beta.id
        )

        self.factory = APIRequestFactory()

    def test_team_lead_sync_on_signup(self):
        # Sign up a Team Lead associated with Team Gamma
        signup_data = {
            'username': 'tl_gamma',
            'email': 'tlg@test.com',
            'password': 'password123',
            'confirm_password': 'password123',
            'full_name': 'TL Gamma',
            'role': 'TEAM_LEAD',
            'team_id': self.team_gamma.id,
            'region_id': self.region_south.id
        }
        serializer = UserSignupSerializer(data=signup_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()

        # Check that Team.lead is automatically synced
        self.team_gamma.refresh_from_db()
        self.assertEqual(self.team_gamma.lead, user)

    def test_team_lead_sync_on_update(self):
        # Update agent_beta to be a TEAM_LEAD and assign to Team Beta
        serializer = UserSerializer(self.agent_beta, data={
            'role_name': 'TEAM_LEAD',
            'team_id': self.team_beta.id
        }, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()

        # Check team_beta has agent_beta as lead
        self.team_beta.refresh_from_db()
        self.assertEqual(self.team_beta.lead, self.agent_beta)

        # Now, move agent_beta to Team Gamma
        serializer2 = UserSerializer(self.agent_beta, data={
            'team_id': self.team_gamma.id
        }, partial=True)
        self.assertTrue(serializer2.is_valid(), serializer2.errors)
        serializer2.save()

        # Check old team (Team Beta) has lead = None
        self.team_beta.refresh_from_db()
        self.assertIsNone(self.team_beta.lead)

        # Check new team (Team Gamma) has lead = agent_beta
        self.team_gamma.refresh_from_db()
        self.assertEqual(self.team_gamma.lead, self.agent_beta)

    def test_user_viewset_filtering(self):
        # tl_alpha should see themselves and agent_alpha (who is in Team Alpha)
        request = self.factory.get('/api/users/')
        force_authenticate(request, user=self.tl_alpha)
        view = UserViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
        usernames = [u['username'] for u in response.data]
        self.assertIn('tl_alpha', usernames)
        self.assertIn('agent_alpha', usernames)
        self.assertNotIn('agent_beta', usernames)

    def test_task_viewset_filtering(self):
        # tl_alpha should see task_alpha but not task_beta
        request = self.factory.get('/api/tasks/')
        force_authenticate(request, user=self.tl_alpha)
        view = TaskViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
        task_ids = [t['id'] for t in response.data['results']]
        self.assertIn(self.task_alpha.id, task_ids)
        self.assertNotIn(self.task_beta.id, task_ids)

    def test_visit_viewset_filtering(self):
        # tl_alpha should see visit_alpha but not visit_beta
        request = self.factory.get('/api/visits/')
        force_authenticate(request, user=self.tl_alpha)
        view = VisitViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
        visit_ids = [v['id'] for v in response.data['results']]
        self.assertIn(self.visit_alpha.id, visit_ids)
        self.assertNotIn(self.visit_beta.id, visit_ids)

    def test_activity_log_viewset_filtering(self):
        # tl_alpha should see log_alpha but not log_beta
        request = self.factory.get('/api/logs/')
        force_authenticate(request, user=self.tl_alpha)
        view = ActivityLogViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
        log_ids = [l['id'] for l in response.data['results']]
        self.assertIn(self.log_alpha.id, log_ids)
        self.assertNotIn(self.log_beta.id, log_ids)

    def test_dashboard_summary_view_scoping(self):
        request = self.factory.get('/api/reports/dashboard-summary/')
        force_authenticate(request, user=self.tl_alpha)
        view = DashboardSummaryView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
        # Scoped counts: total_tasks = 1 (task_alpha), active_visits = 1 (visit_alpha)
        self.assertEqual(response.data['total_tasks'], 1)
        self.assertEqual(response.data['active_visits'], 1)

    def test_team_serializer_lead_name_fallbacks(self):
        # Test when team.lead is set
        serializer = TeamSerializer(self.team_alpha)
        self.assertEqual(serializer.data['lead_name'], 'tl_alpha')

        # Test fallback when team.lead is None but there is a TEAM_LEAD user profile
        self.team_alpha.lead = None
        self.team_alpha.save()
        serializer = TeamSerializer(self.team_alpha)
        self.assertEqual(serializer.data['lead_name'], 'tl_alpha')

        # Test Unassigned fallback
        # Temporarily change tl_alpha's role to FIELD_AGENT
        self.tl_alpha.profile.role = self.role_agent
        self.tl_alpha.profile.save()
        serializer = TeamSerializer(self.team_alpha)
        self.assertEqual(serializer.data['lead_name'], 'Unassigned')
