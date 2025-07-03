
from django.shortcuts import render, redirect
from core.models import Projet
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request, 'home.html')

@login_required(login_url='login')
def chatlive(request):
    # ...
    return render(request, 'chatlive.html')

@login_required(login_url='login')
def apropos(request):
    # ...
    return render(request, 'apropos.html')
@login_required(login_url='login')
def projet(request):
    if request.method == 'POST':
        nom = request.POST['nom']
        email = request.POST['email']
        telephone = request.POST['telephone']
        intitule = request.POST['intitule']
        fichier = request.FILES['fichier']
        Projet.objects.create(
            nom=nom,
            email=email,
            telephone=telephone,
            intitule=intitule,
            fichier=fichier
        )
        return render(request, 'projet.html', {'success': True})
    return render(request, 'projet.html')