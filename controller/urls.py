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
    path('delprovider/<int:id>',DelProvider.as_view()),
    path('download/<int:id>',Download.as_view())
]
