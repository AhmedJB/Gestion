from django.shortcuts import render,HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from .serializer import ClientSerializer, InvoiceSerializer, OrderDetailsSerializer, OrderSerializer, RegisterSerializer,ProviderSerializer,ProductSerializer,OptionsSerializer
from .models import *
from .tasks import execute_task
from gestionStock.settings import MEDIA_ROOT
from django.core.files import File
from .helper import format_number
import random

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
        task = Invoices.objects.filter(f_id=id)
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

class Invoice(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def  get(self,request,format=None):
        invoices =  Invoices.objects.all().order_by('-date')
        ins = InvoiceSerializer(invoices,many=True).data
        return Response(ins,status.HTTP_200_OK)


class AddProvider(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format=None):
        data = request.data 
        s = ProviderSerializer(data = data)
        p = Provider(name = data['name'],email = data['email'],phone=data['phone'],address=data['address'])
        p.save()
        ps = ProviderSerializer(p).data
        return Response(ps)

    def get(self,request,format=None):
        ps = Provider.objects.all()
        s = ProviderSerializer(ps,many=True).data
        return Response(s,status.HTTP_200_OK)




class ModifyProvider(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,id,format="None"):
        p = Provider.objects.filter(id=id)
        if len(p) != 0:
            p = p[0]
            data = ProviderSerializer(p).data
            p.delete()
        else:
            data= {}
        
        return Response(data, status.HTTP_200_OK)

    def post(self,request,id,format="None"):
        data = request.data
        supplier = Provider.objects.filter(id=id)[0]
        supplier.name = data['name']
        supplier.email = data['email']
        supplier.phone = data['phone']
        supplier.address = data['address']
        supplier.credit = float(data['credit']) - float(data['creditp'])
        supplier.save()
        s = ProviderSerializer(supplier).data
        return Response(s,status.HTTP_200_OK)

class AddClient(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format=None):
        data = request.data 
        s = ClientSerializer(data = data)
        p = Client(name = data['name'],email = data['email'],phone=data['phone'],address=data['address'])
        p.save()
        ps = ClientSerializer(p).data
        return Response(ps)

    def get(self,request,format=None):
        ps = Client.objects.all()
        s = ClientSerializer(ps,many=True).data
        return Response(s,status.HTTP_200_OK)


class OpenClient(APIView):


    def get(self,request,format=None):
        ps = Client.objects.all()
        s = ClientSerializer(ps,many=True).data
        print("here")
        return Response(s,status.HTTP_200_OK)



class ModifyClient(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,id,format="None"):
        p = Client.objects.filter(id=id)
        if len(p) != 0:
            p = p[0]
            data = ClientSerializer(p).data
            p.delete()
        else:
            data= {}
        
        return Response(data, status.HTTP_200_OK)

    def post(self,request,id,format="None"):
        data = request.data
        client = Client.objects.filter(id=id)[0]
        client.name = data['name']
        client.email = data['email']
        client.phone = data['phone']
        client.address = data['address']
        client.credit = float(data['credit']) - float(data['creditp'])
        client.save()
        s = ClientSerializer(client).data
        return Response(s,status.HTTP_200_OK)






class AddProduct(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format=None):
        data = request.data 
        supplier = Provider.objects.filter(id=data['fournisseur'])[0]
        product = supplier.product_set.create(name=data['product']['name'],ptype=data['product']['ptype'],place = int(data['product']['place']),price_vente=data['product']['price_vente'],price_achat=data['product']['price_achat'],quantity=data['product']['quantity'])
        product.p_id = format_number(random.randrange(0,9999999999999))
        product.save()
        options = product.options_set.create(metal=data['options']['metal'],type=data['options']['type'])
        options.save()
        resp = {
            'fournisseur':ProviderSerializer(supplier).data,
            'product':ProductSerializer(product).data,
            'options' : OptionsSerializer(options).data
        }
        return Response(resp,status.HTTP_200_OK)

    
    def get(self,request,format=None):
        resps = []
        products = Product.objects.all()
        for product  in products:
            supplier = product.provider
            options = product.options_set.all()[0]
            resp = {
            'fournisseur':ProviderSerializer(supplier).data,
            'product':ProductSerializer(product).data,
            'options' : OptionsSerializer(options).data
            }
            resps.append(resp)
        return Response(resps,status.HTTP_200_OK)


class ModifyProduct(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,id,format="None"):
        p = Product.objects.filter(p_id = id)
        if len(p) != 0:
            p = p[0]
            data = ProductSerializer(p).data
            p.delete()
        else:
            data= {}


        return Response(data, status.HTTP_200_OK)

    def post(self,request,id,format="None"):
        data = request.data
        
        p = Product.objects.filter(p_id = id)[0]
        print(data)
        supplier = Provider.objects.filter(id=data['fournisseur']['id'])[0]
        p.provider = supplier
        p.name=data['product']['name']
        p.ptype=data['product']['ptype']
        p.price_vente=data['product']['price_vente']
        p.price_achat=data['product']['price_achat']
        p.quantity=data['product']['quantity']
        p.place = int(data['product']['place'])
        opt = p.options_set.all()[0]
        opt.metal = data['options']['metal']
        opt.type = data['options']['type']
        p.save()
        opt.save()

        resp = {
            'fournisseur':ProviderSerializer(supplier).data,
            'product':ProductSerializer(p).data,
            'options' : OptionsSerializer(opt).data
        }

        return Response(resp,status.HTTP_200_OK)


class OrderProduct(APIView):

    def get(self,request,id,format="None"):
        p = Product.objects.filter(p_id = id)
        if len(p) > 0:
            p = p[0]
            data = ProductSerializer(p).data
        else:
            data = False
        
        return Response(data,status.HTTP_200_OK)
    

    def post(self):
        pass


class OrderV(APIView):
    def get(self):
        pass

    def post(self,request,format="None"):
        data = request.data 
        resp = {}
        client = Client.objects.filter(id=data['client']['id'])[0]
        credit = data['sub_options']['total'] - data['sub_options']['paid']
        if (credit > 0):
            client.credit += credit
            client.save()

        resp['client'] = ClientSerializer(client).data
        order = Order.objects.create(client = client,total = data['sub_options']['total'])
        resp['order'] = OrderSerializer(order).data
        order.save()
        temp = []
        for prod in data['products']:
            od = OrderDetails.objects.create(order=order, product_name = prod['name'], quantity = prod['quantity'],prix =prod['price_vente'])
            od.save()
            p = Product.objects.filter(id=prod['id'])[0]
            p.quantity -= prod['quantity']
            p.save()
            temp.append(OrderDetailsSerializer(od).data)
            pass

        print(data)
        print(resp)
        return Response(resp,status.HTTP_200_OK)
        

