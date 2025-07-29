from django.shortcuts import render, redirect
from django.contrib import messages
from core.models import  Project
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from datetime import datetime, timedelta
from django.db.models import Count
from django.utils import timezone

# ✅ Page d'accueil
def home(request):
    return render(request, 'home.html')

# ✅ Inscription
def register(request):
    if request.method == 'POST':
        try:
            username = request.POST['username']
            password1 = request.POST['password1']
            password2 = request.POST['password2']

            if password1 != password2:
                messages.error(request, "Les mots de passe ne correspondent pas.")
                return redirect('home')

            if User.objects.filter(username=username).exists():
                messages.error(request, "Ce nom d'utilisateur existe déjà.")
                return redirect('home')

            user = User.objects.create_user(username=username, password=password1)
            user.save()
            messages.success(request, "Compte créé avec succès. Vous pouvez vous connecter.")
            return redirect('home')
        except Exception as e:
            messages.error(request, f"Erreur lors de l'inscription: {str(e)}")
            return redirect('home')
    else:
        return redirect('home')

# ✅ Connexion
def login_view(request):
    if request.method == 'POST':
        try:
            username = request.POST['username']
            password = request.POST['password']

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                messages.success(request, f"Bienvenue {user.username}!")
                return redirect('home')
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
                return redirect('home')
        except Exception as e:
            messages.error(request, f"Erreur lors de la connexion: {str(e)}")
            return redirect('home')
    else:
        return redirect('home')

# ✅ Déconnexion
def logout_view(request):
    logout(request)
    messages.success(request, "Vous avez été déconnecté avec succès.")
    return redirect('home')

# ✅ Connexion JSON pour l'interface admin
@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None and user.is_staff:
                login(request, user)
                return JsonResponse({
                    'success': True,
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    }
                })
            else:
                return JsonResponse({
                    'success': False,
                    'error': 'Identifiants incorrects ou utilisateur non autorisé'
                })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Méthode non autorisée'
    })

def projet(request):
    if request.method == 'POST':
        nom = request.POST.get('nom')
        email = request.POST.get('email')
        telephone = request.POST.get('telephone')
        intitule = request.POST.get('intitule')
        fichier = request.FILES.get('fichier')
        Projet.objects.create(
            nom=nom,
            email=email,
            telephone=telephone,
            intitule=intitule,
            fichier=fichier
        )
        return render(request, 'projet.html', {'success': True})
    return render(request, 'projet.html')


def chatlive(request):
    return render(request, 'chatlive.html')


def apropos(request):
    return render(request, 'apropos.html')
from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    return redirect('home')
# ----------------------------------------------------------------------------------------
from django.contrib.auth.decorators import login_required

@login_required
def projet(request):
    if request.method == 'POST':
        nom = request.POST['nom']
        email = request.POST['email']
        telephone = request.POST['telephone']
        intitule = request.POST['intitule']
        fichier = request.FILES['fichier']

        # Création et sauvegarde du projet
        Project.objects.create(
            user=request.user,
            nom=nom,
            email=email,
            telephone=telephone,
            intitule=intitule,
            fichier=fichier
        )

        projets = Project.objects.filter(user=request.user)
        return render(request, 'projet.html', {'success': True, 'projects': projets})

    else:
        projets = Project.objects.filter(user=request.user)
        return render(request, 'projet.html', {'projects': projets})

# ============================================================================
# VUES API POUR L'ADMIN
# ============================================================================

@login_required
def api_projects(request):
    """API pour récupérer tous les projets"""
    try:
        projects = Project.objects.all().order_by('-date_soumission')
        
        projects_data = []
        for project in projects:
            projects_data.append({
                'id': project.id,
                'name': project.intitule,
                'author': project.nom,
                'authorEmail': project.email,
                'authorPhone': project.telephone,
                'description': project.intitule,
                'status': project.statut,
                'date': project.date_soumission.isoformat(),
                'files': [
                    {
                        'name': project.fichier.name.split('/')[-1],
                        'size': f"{project.fichier.size / 1024 / 1024:.1f} MB" if project.fichier.size else "0 MB",
                        'type': 'pdf' if project.fichier.name.endswith('.pdf') else 'document'
                    }
                ] if project.fichier else [],
                'adminComment': project.commentaire_admin or "",
                'priority': 'high' if project.statut == 'pending' else 'medium'
            })
        
        return JsonResponse({'success': True, 'projects': projects_data})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
def api_project_detail(request, project_id):
    """API pour récupérer les détails d'un projet"""
    try:
        project = Project.objects.get(id=project_id)
        
        project_data = {
            'id': project.id,
            'name': project.intitule,
            'author': project.nom,
            'authorEmail': project.email,
            'authorPhone': project.telephone,
            'description': project.intitule,
            'status': project.statut,
            'date': project.date_soumission.isoformat(),
            'files': [
                {
                    'name': project.fichier.name.split('/')[-1],
                    'size': f"{project.fichier.size / 1024 / 1024:.1f} MB" if project.fichier.size else "0 MB",
                    'type': 'pdf' if project.fichier.name.endswith('.pdf') else 'document'
                }
            ] if project.fichier else [],
            'adminComment': project.commentaire_admin or "",
            'priority': 'high' if project.statut == 'pending' else 'medium'
        }
        
        return JsonResponse({'success': True, 'project': project_data})
    except Project.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Projet non trouvé'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@login_required
def api_update_project_status(request, project_id):
    """API pour mettre à jour le statut d'un projet"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            project = Project.objects.get(id=project_id)
            
            project.statut = data.get('status', project.statut)
            project.commentaire_admin = data.get('comment', project.commentaire_admin)
            project.save()
            
            return JsonResponse({'success': True, 'message': 'Statut mis à jour avec succès'})
        except Project.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Projet non trouvé'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée'})

@login_required
def api_project_stats(request):
    """API pour récupérer les statistiques des projets"""
    try:
        # Statistiques générales
        total_projects = Project.objects.count()
        pending_projects = Project.objects.filter(statut='pending').count()
        accepted_projects = Project.objects.filter(statut='accepted').count()
        rejected_projects = Project.objects.filter(statut='rejected').count()
        in_progress_projects = Project.objects.filter(statut='in-progress').count()
        
        # Statistiques mensuelles (6 derniers mois)
        monthly_stats = []
        for i in range(6):
            date = timezone.now() - timedelta(days=30*i)
            month_start = date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(seconds=1)
            
            count = Project.objects.filter(
                date_soumission__gte=month_start,
                date_soumission__lte=month_end
            ).count()
            
            monthly_stats.append({
                'month': month_start.strftime('%B %Y'),
                'count': count
            })
        
        # Projets récents
        recent_projects = Project.objects.all().order_by('-date_soumission')[:5]
        recent_data = []
        for project in recent_projects:
            recent_data.append({
                'id': project.id,
                'name': project.intitule,
                'author': project.nom,
                'status': project.statut,
                'date': project.date_soumission.isoformat()
            })
        
        stats = {
            'total': total_projects,
            'pending': pending_projects,
            'accepted': accepted_projects,
            'rejected': rejected_projects,
            'in_progress': in_progress_projects,
            'monthly_stats': monthly_stats,
            'recent_projects': recent_data
        }
        
        return JsonResponse({'success': True, 'stats': stats})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
def api_search_projects(request):
    """API pour rechercher des projets"""
    try:
        query = request.GET.get('q', '')
        status_filter = request.GET.get('status', '')
        date_filter = request.GET.get('date', '')
        
        projects = Project.objects.all()
        
        # Filtre par recherche
        if query:
            projects = projects.filter(intitule__icontains=query)
        
        # Filtre par statut
        if status_filter:
            projects = projects.filter(statut=status_filter)
        
        # Filtre par date
        if date_filter:
            today = timezone.now().date()
            if date_filter == 'today':
                projects = projects.filter(date_soumission__date=today)
            elif date_filter == 'week':
                week_ago = today - timedelta(days=7)
                projects = projects.filter(date_soumission__date__gte=week_ago)
            elif date_filter == 'month':
                month_ago = today - timedelta(days=30)
                projects = projects.filter(date_soumission__date__gte=month_ago)
        
        projects_data = []
        for project in projects.order_by('-date_soumission'):
            projects_data.append({
                'id': project.id,
                'name': project.intitule,
                'author': project.nom,
                'authorEmail': project.email,
                'authorPhone': project.telephone,
                'description': project.intitule,
                'status': project.statut,
                'date': project.date_soumission.isoformat(),
                'files': [
                    {
                        'name': project.fichier.name.split('/')[-1],
                        'size': f"{project.fichier.size / 1024 / 1024:.1f} MB" if project.fichier.size else "0 MB",
                        'type': 'pdf' if project.fichier.name.endswith('.pdf') else 'document'
                    }
                ] if project.fichier else [],
                'adminComment': project.commentaire_admin or "",
                'priority': 'high' if project.statut == 'pending' else 'medium'
            })
        
        return JsonResponse({'success': True, 'projects': projects_data})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})