from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [
   
    path('register',Register.as_view()),
    path('token',TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('session',TestSession.as_view()),
    path('provider',AddProvider.as_view()),
    path('modprovider/<int:id>',ModifyProvider.as_view()),
    path('client',AddClient.as_view()),
    path('getclients',OpenClient.as_view()),
    path('modclient/<int:id>',ModifyClient.as_view()),
    path('product',AddProduct.as_view()),
    path('invoices',Invoice.as_view()),
    path('modproduct/<str:id>',ModifyProduct.as_view()),
    path('getproduct/<str:id>',OrderProduct.as_view()),

    # order urls 
    path('order',OrderV.as_view()),
    path('filterorder',OrderFilter.as_view()),



    ###
    path('download/<str:id>',Download.as_view()),
]
