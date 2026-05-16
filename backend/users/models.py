from django.db import models
from django.contrib.auth.models import AbstractUser

class Role(models.Model):
    ADMIN = 'ADMIN'
    REGIONAL_MANAGER = 'REGIONAL_MANAGER'
    TEAM_LEAD = 'TEAM_LEAD'
    FIELD_AGENT = 'FIELD_AGENT'
    AUDITOR = 'AUDITOR'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (REGIONAL_MANAGER, 'Regional Manager'),
        (TEAM_LEAD, 'Team Lead'),
        (FIELD_AGENT, 'Field Agent'),
        (AUDITOR, 'Auditor'),
    ]
    
    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    # Custom fields for our Field Ops system
    pass

class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.ForeignKey(Role, on_delete=models.PROTECT)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    team = models.ForeignKey('Team', on_delete=models.SET_NULL, null=True, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

class Team(models.Model):
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='teams')
    lead = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_teams')

    def __str__(self):
        return f"{self.name} ({self.region.name})"
