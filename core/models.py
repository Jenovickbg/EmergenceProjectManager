from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    intitule = models.TextField()
    fichier = models.FileField(upload_to='projets/')
    date_soumission = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.intitule
