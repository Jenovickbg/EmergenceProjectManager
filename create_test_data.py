#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta
import random

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EmergenceProjectManager.settings')
django.setup()

from core.models import Project
from django.contrib.auth.models import User

def create_test_projects():
    """Créer des projets de test pour l'interface admin"""
    
    # Vérifier si des projets existent déjà
    if Project.objects.count() > 0:
        print("Des projets existent déjà dans la base de données.")
        return
    
    # Créer un utilisateur de test si nécessaire
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@emergence.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    
    # Données de test
    test_projects = [
        {
            'user': user,
            'nom': 'Jean Dupont',
            'email': 'jean.dupont@email.com',
            'telephone': '+243 999 123 456',
            'intitule': 'Plateforme E-commerce pour PME',
            'statut': 'pending',
            'commentaire_admin': 'Projet innovant avec un bon potentiel commercial.'
        },
        {
            'user': user,
            'nom': 'Marie Martin',
            'email': 'marie.martin@email.com',
            'telephone': '+243 810 987 654',
            'intitule': 'Application Mobile de Livraison',
            'statut': 'accepted',
            'commentaire_admin': 'Excellente proposition avec un marché en croissance.'
        },
        {
            'user': user,
            'nom': 'Pierre Durand',
            'email': 'pierre.durand@email.com',
            'telephone': '+243 999 555 777',
            'intitule': 'Système de Gestion des Stocks',
            'statut': 'in-progress',
            'commentaire_admin': 'En cours de développement avec l\'équipe technique.'
        },
        {
            'user': user,
            'nom': 'Sophie Bernard',
            'email': 'sophie.bernard@email.com',
            'telephone': '+243 810 111 222',
            'intitule': 'Plateforme de Formation en Ligne',
            'statut': 'rejected',
            'commentaire_admin': 'Projet intéressant mais nécessite plus de financement.'
        },
        {
            'user': user,
            'nom': 'Lucas Petit',
            'email': 'lucas.petit@email.com',
            'telephone': '+243 999 333 444',
            'intitule': 'Application de Réservation de Taxis',
            'statut': 'pending',
            'commentaire_admin': 'Analyse en cours du plan d\'affaires.'
        },
        {
            'user': user,
            'nom': 'Emma Roux',
            'email': 'emma.roux@email.com',
            'telephone': '+243 810 666 888',
            'intitule': 'Système de Paiement Mobile',
            'statut': 'accepted',
            'commentaire_admin': 'Projet prometteur avec une équipe compétente.'
        },
        {
            'user': user,
            'nom': 'Thomas Moreau',
            'email': 'thomas.moreau@email.com',
            'telephone': '+243 999 777 999',
            'intitule': 'Application de Gestion des Déchets',
            'statut': 'in-progress',
            'commentaire_admin': 'Développement en cours avec partenariat municipal.'
        },
        {
            'user': user,
            'nom': 'Julie Leroy',
            'email': 'julie.leroy@email.com',
            'telephone': '+243 810 444 555',
            'intitule': 'Plateforme de Covoiturage',
            'statut': 'pending',
            'commentaire_admin': 'En attente de validation du budget.'
        }
    ]
    
    # Créer les projets avec des dates différentes
    for i, project_data in enumerate(test_projects):
        # Créer des dates différentes pour chaque projet
        date_soumission = datetime.now() - timedelta(days=random.randint(1, 30))
        
        project = Project.objects.create(
            user=project_data['user'],
            nom=project_data['nom'],
            email=project_data['email'],
            telephone=project_data['telephone'],
            intitule=project_data['intitule'],
            statut=project_data['statut'],
            commentaire_admin=project_data['commentaire_admin'],
            date_soumission=date_soumission
        )
        print(f"✅ Projet créé: {project.intitule} - Statut: {project.statut}")
    
    print(f"\n🎉 {len(test_projects)} projets de test ont été créés avec succès!")
    print("Vous pouvez maintenant tester l'interface admin avec des vraies données.")

if __name__ == '__main__':
    create_test_projects() 