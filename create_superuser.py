#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EmergenceProjectManager.settings')
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    try:
        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(username='emergence').exists():
            print("L'utilisateur 'emergence' existe déjà!")
            return
        
        # Créer le superutilisateur
        user = User.objects.create_user(
            username='emergence',
            email='emergence@emergence.com',
            password='emergence123',
            is_staff=True,
            is_superuser=True
        )
        
        print(f"Superutilisateur créé avec succès!")
        print(f"Nom d'utilisateur: emergence")
        print(f"Mot de passe: emergence123")
        print(f"Email: emergence@emergence.com")
        
    except Exception as e:
        print(f"Erreur lors de la création du superutilisateur: {e}")

if __name__ == '__main__':
    create_superuser() 