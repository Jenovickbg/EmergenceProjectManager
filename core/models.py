from django.db import models

class Projet(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=30)
    intitule = models.TextField()
    fichier = models.FileField(upload_to='projets/')

    def __str__(self):
        return self.intitule