from django.db import models
from django.conf import settings

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('TASK_CREATED', 'Task Created'),
        ('TASK_ASSIGNED', 'Task Assigned'),
        ('VISIT_STARTED', 'Visit Started'),
        ('VISIT_COMPLETED', 'Visit Completed'),
        ('STATUS_CHANGED', 'Status Changed'),
    ]

    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='activities')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    target_type = models.CharField(max_length=50) # e.g., 'Task', 'Visit'
    target_id = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.actor.username if self.actor else 'System'} - {self.action} on {self.target_type}:{self.target_id}"
