from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(default='',null=True)



    def __str__(self):
        return self.username

class Provider(models.Model):
    name = models.CharField(max_length=255,default='')
    email = models.CharField(max_length=255,default='')
    phone = models.CharField(max_length=255,default='')
    address = models.CharField(max_length=255,default="")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class Product(models.Model):
    provider = models.ForeignKey(Provider , on_delete=models.CASCADE)
    p_id = models.CharField(max_length=255,default='')
    name = models.CharField(max_length=255,default='')
    ptype = models.CharField(max_length=255,default='')
    price_vente = models.FloatField(default=0)
    price_achat = models.FloatField(default=0)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Options(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    metal = models.CharField(max_length=255,default='')
    type = models.CharField(max_length=255,default='')

    def __str__(self):
        return self.metal


class Invoices(models.Model):
    f_id = models.CharField(max_length=255,default='')
    path  = models.CharField(max_length=255,default='')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.f_id
