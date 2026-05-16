import os
import django
import sys
from datetime import datetime, timedelta
from django.utils import timezone

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Role, Region, Team, EmployeeProfile
from tasks.models import Task
from visits.models import Visit

User = get_user_model()

def seed():
    print("Seeding database...")
    
    # 1. Create Roles
    roles = {}
    for role_name, role_label in Role.ROLE_CHOICES:
        role, created = Role.objects.get_or_create(name=role_name)
        roles[role_name] = role
        if created:
            print(f"Created role: {role_name}")

    # 2. Create Regions
    regions = {}
    for region_name in ['North', 'South', 'East', 'West']:
        region, created = Region.objects.get_or_create(name=region_name)
        regions[region_name] = region
        if created:
            print(f"Created region: {region_name}")

    # 3. Create Teams
    teams = {}
    for team_name in ['Team Alpha', 'Team Beta', 'Team Gamma']:
        region = regions['North'] if 'Alpha' in team_name else regions['South']
        team, created = Team.objects.get_or_create(name=team_name, region=region)
        teams[team_name] = team
        if created:
            print(f"Created team: {team_name}")

    # 4. Create Users
    users_data = [
        ('admin', 'admin@example.com', 'ADMIN', None, None),
        ('rm_north', 'rm_n@example.com', 'REGIONAL_MANAGER', 'North', None),
        ('tl_alpha', 'tl_a@example.com', 'TEAM_LEAD', 'North', 'Team Alpha'),
        ('agent_1', 'a1@example.com', 'FIELD_AGENT', 'North', 'Team Alpha'),
        ('agent_2', 'a2@example.com', 'FIELD_AGENT', 'South', 'Team Beta'),
        ('auditor', 'auditor@example.com', 'AUDITOR', None, None),
    ]

    for username, email, role_name, region_name, team_name in users_data:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_staff': role_name == 'ADMIN', 'is_superuser': role_name == 'ADMIN'}
        )
        if created:
            user.set_password('password123')
            user.save()
            
        # Create or update Profile
        profile, p_created = EmployeeProfile.objects.get_or_create(
            user=user,
            defaults={
                'role': roles[role_name],
                'region': regions[region_name] if region_name else None,
                'team': teams[team_name] if team_name else None,
                'employee_id': f"EMP_{username.upper()}"
            }
        )
        if p_created:
            print(f"Created profile for user: {username} with role {role_name}")

    # 5. Create Tasks
    tl_alpha = User.objects.get(username='tl_alpha')
    agent_1 = User.objects.get(username='agent_1')
    
    tasks_data = [
        ("Store Audit - Sector 7", "Perform full inventory audit of Sector 7 store.", tl_alpha, agent_1, 'North', 'Team Alpha', 'HIGH'),
        ("Safety Inspection", "Check safety protocols at the North distribution center.", tl_alpha, agent_1, 'North', 'Team Alpha', 'URGENT'),
        ("Maintenance Check", "Routine maintenance of field equipment.", tl_alpha, None, 'North', 'Team Alpha', 'LOW'),
    ]

    for title, desc, creator, assignee, region_name, team_name, priority in tasks_data:
        Task.objects.get_or_create(
            title=title,
            defaults={
                'description': desc,
                'created_by': creator,
                'assigned_to': assignee,
                'region': regions[region_name],
                'team': teams[team_name],
                'priority': priority,
                'due_date': timezone.now() + timedelta(days=2),
                'status': 'ASSIGNED' if assignee else 'PENDING'
            }
        )
    print("Database seeding completed.")

if __name__ == "__main__":
    seed()
