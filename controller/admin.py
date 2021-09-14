from django.contrib import admin
from .models import CustomUser,Provider,Product,Options,Invoices

# Register your models here.


admin.site.register(CustomUser)
admin.site.register(Provider)
admin.site.register(Product)
admin.site.register(Options)
admin.site.register(Invoices)