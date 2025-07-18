from django.shortcuts import render, redirect
from django.contrib import messages
from core.models import  Project
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

# ✅ Page d'accueil
def home(request):
    return render(request, 'home.html')

# ✅ Inscription
def register(request):
    if request.method == 'POST':
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
    else:
        return redirect('home')

# ✅ Connexion
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
            return redirect('home')
    else:
        return redirect('home')

# ✅ Déconnexion
def logout_view(request):
    logout(request)
    return redirect('home')


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