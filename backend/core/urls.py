from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from users.views import UserViewSet, RoleViewSet, RegionViewSet, TeamViewSet
from tasks.views import TaskViewSet
from visits.views import VisitViewSet
from logs.views import ActivityLogViewSet
from reports.views import ReportSummaryView, DashboardSummaryView
from users.serializers import MyTokenObtainPairView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'regions', RegionViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'visits', VisitViewSet)
router.register(r'logs', ActivityLogViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Auth
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Custom Reports/Dashboard
    path('api/reports/summary/', ReportSummaryView.as_view(), name='report_summary'),
    path('api/dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    
    # Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
