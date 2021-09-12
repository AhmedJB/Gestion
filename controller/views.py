from django.shortcuts import render,HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from .serializer import RegisterSerializer,ProviderSerializer,ProductSerializer
from .models import *
from .tasks import execute_task
from gestionStock.settings import MEDIA_ROOT
from django.core.files import File

# Create your views here.

class Register(APIView):
    

    def post(self,request,format=None):
        data = request.data 
        print(data)
        s = RegisterSerializer(data=data)
        if s.is_valid():
            print('valid')
            resp = s.save()
            print(resp)
            return Response(resp)
        else:
            print('not valid')
            return Response({'result':'not created'})


class TestSession(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,format=None):
        user = request.user
        print(f'User is {user}')
        u = RegisterSerializer(user).data
        return Response(u)




class Download(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,id,format=None):
        user = request.user
        task = user.tasks_set.filter(id=id)
        if len(task) != 0:
            task = task[0]
            path = MEDIA_ROOT + '/' + task.path
            f = open(path, 'rb')
            pdfFile = File(f)
            response = HttpResponse(pdfFile.read())
            response['Content-Disposition'] = 'attachment;'
            return response
        else:
            return Response({"result" : 'failed'},status.HTTP_400_BAD_REQUEST)


class AddProvider(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format=None):
        data = request.data 
        s = ProviderSerializer(data = data)
        if s.is_valid():
            p = Provider(name = data['name'],email = data['email'])
            p.save()
            ps = ProviderSerializer(p).data
            return Response(ps)


    