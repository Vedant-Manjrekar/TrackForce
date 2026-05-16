from .models import ActivityLog

def log_activity(user, action, target_type, target_id, details=None):
    ActivityLog.objects.create(
        actor=user,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=details or {}
    )
