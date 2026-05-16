from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role.name == 'ADMIN'

class IsRegionalManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role.name == 'REGIONAL_MANAGER'

class IsTeamLead(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role.name == 'TEAM_LEAD'

class IsFieldAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role.name == 'FIELD_AGENT'

class IsAuditor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role.name == 'AUDITOR'

class RoleBasedAccess(permissions.BasePermission):
    """
    General permission to check if user has one of the allowed roles.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        allowed_roles = getattr(view, 'allowed_roles', [])
        if not allowed_roles:
            return True # If no roles specified, allow all authenticated
            
        return request.user.profile.role.name in allowed_roles
