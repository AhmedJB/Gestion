from django.contrib import admin
from .models import CustomUser,Provider

# Register your models here.


admin.site.register(CustomUser)
admin.site.register(Provider)