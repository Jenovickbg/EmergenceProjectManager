"""EmergenceProjectManager URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core.views import *
from adm.views import *
from django.conf import settings
from django.conf.urls.static import static
from core import views as core_views
from adm import views as adm_views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', core_views.home, name='home'),
    path('logout/', core_views.logout_view, name='logout'),
    path('projet/', core_views.projet, name='projet'),
    path('chatlive/', core_views.chatlive, name='chatlive'),
    path('apropos/', core_views.apropos, name='apropos'),
    path('login/', core_views.login_view, name='login'),
    path('register/', core_views.register, name='register'),
    # urls pour adm :
    path('admi/', adm_views.admi, name='admi'),
    path('parametres/', adm_views.parametres, name='parametres'),
    path('projet_admi/', adm_views.projet_admi, name='projet_admi'),
    path('utilisateurs/', adm_views.utilisateurs, name='utilisateurs'),
    
    # API URLs pour l'admin
    path('api/admin/login/', core_views.admin_login, name='admin_login'),
    path('api/projects/', core_views.api_projects, name='api_projects'),
    path('api/projects/<int:project_id>/', core_views.api_project_detail, name='api_project_detail'),
    path('api/projects/<int:project_id>/status/', core_views.api_update_project_status, name='api_update_project_status'),
    path('api/projects/stats/', core_views.api_project_stats, name='api_project_stats'),
    path('api/projects/search/', core_views.api_search_projects, name='api_search_projects'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)