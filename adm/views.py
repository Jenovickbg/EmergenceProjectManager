from django.shortcuts import render
from django.urls import path
from django.conf import settings

def admi(request):
    return render(request, 'admi.html')

def parametres(request):
    return render(request, 'parametres.html')

def projet_admi(request):
    return render(request, 'projet_admi.html')

def utilisateurs(request):
    return render(request, 'utilisateurs.html')