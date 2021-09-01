from django.urls import path,re_path
from .views import *



urlpatterns = [
    re_path(r'.*',Index.as_view(), name='react_view')

]