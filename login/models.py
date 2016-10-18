from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class LocalUser(models.Model):
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=300)
    password = models.CharField(max_length=200)
    profile = models.ImageField(upload_to='images/profiles')

    def __str__(self):
        return self.name