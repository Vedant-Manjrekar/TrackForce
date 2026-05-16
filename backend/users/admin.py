from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Role, Region, Team, EmployeeProfile

admin.site.register(User, UserAdmin)
admin.site.register(Role)
admin.site.register(Region)
admin.site.register(Team)
admin.site.register(EmployeeProfile)
