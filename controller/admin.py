from django.contrib import admin
from .models import CustomUser,Client, Echeance, Order, OrderDetails,Provider,Product,Options,Invoices

# Register your models here.


admin.site.register(CustomUser)
admin.site.register(Provider)
admin.site.register(Product)
admin.site.register(Options)
admin.site.register(Invoices)
admin.site.register(Order)
admin.site.register(OrderDetails)
admin.site.register(Echeance)
admin.site.register(Client)