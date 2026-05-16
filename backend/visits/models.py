from django.db import models
from django.conf import settings

class Visit(models.Model):
    STATUS_CHOICES = [
        ('STARTED', 'Started'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    task = models.ForeignKey('tasks.Task', on_delete=models.CASCADE, related_name='visits')
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='visits')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    outcome = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='STARTED')
    
    # Mock AI generated fields
    ai_summary = models.TextField(blank=True)
    ai_recommendation = models.TextField(blank=True)
    ai_risk_flag = models.CharField(max_length=20, default='LOW')

    def __str__(self):
        return f"Visit for {self.task.title} by {self.agent.username}"
