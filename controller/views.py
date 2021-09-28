from django.shortcuts import render,HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from .serializer import ClientSerializer, InvoiceSerializer, OrderDetailsSerializer, OrderSerializer, RegisterSerializer,ProviderSerializer,ProductSerializer,OptionsSerializer,EcheanceSerializer
from .models import *
from .tasks import execute_task
from gestionStock.settings import MEDIA_ROOT
from django.core.files import File
from .helper import format_fact, format_number
from br_handler import Generator
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


class postDownload(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format=None):
        data = request.data 
        print('here')
        print(data)
        if len(data) > 0:
            g = Generator()
            g.genPdf(data)
            path = MEDIA_ROOT + '/br.pdf'
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
        c = float(data['credit']) - float(data['creditp'])
        if c < 0:
            c = 0
        supplier.credit = c
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
        print(data)
        supplier = Provider.objects.filter(id=data['fournisseur'])[0]
        if (supplier.credit + ((float(data['product']['quantity']) * float(data['product']['price_achat'])) - float(data['product']['paid'])) >= 0):
            supplier.credit += ((float(data['product']['quantity']) * float(data['product']['price_achat'])) - float(data['product']['paid']))
        product = supplier.product_set.create(name=data['product']['name'],ptype=data['product']['ptype'],price_vente=data['product']['price_vente'],price_achat=data['product']['price_achat'],quantity=data['product']['quantity'],paid=data['product']['paid'])
        while True:
            idd = format_number(random.randrange(0,9999999999999))
            orders = Product.objects.filter(p_id=idd)
            if len(orders) == 0:
                break
        
        product.p_id = idd
        product.save()
        supplier.save()
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
        credit = (p.paid - float(data['product']['paid']))
        if (supplier.credit + credit >= 0):
            supplier.credit   += credit
        else:
            supplier.credit = 0
        
        p.provider = supplier
        p.name=data['product']['name']
        p.ptype=data['product']['ptype']
        p.price_vente=data['product']['price_vente']
        p.price_achat=data['product']['price_achat']
        p.quantity=data['product']['quantity']
        p.paid  = float(data['product']['paid'])
        #p.place = int(data['product']['place'])
        opt = p.options_set.all()[0]
        opt.metal = data['options']['metal']
        opt.type = data['options']['type']
        p.save()
        supplier.save()
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
    def get(self,request,format="none"):
        data = request.data
        print(data)
        resp = {}
        return Response(resp,status.HTTP_200_OK)

    def post(self,request,format="None"):
        data = request.data 
        resp = {}
        client = Client.objects.filter(id=data['client']['id'])[0]
        credit = data['sub_options']['total'] - data['sub_options']['paid']
        if (credit > 0):
            client.credit += credit
            client.save()

        resp['client'] = ClientSerializer(client).data
        order = Order.objects.create(client = client,total = data['sub_options']['total'],paid=data['sub_options']['paid'],mode=data['sub_options']['modePayment'])
        while True:
            idd = format_fact(random.randrange(0,99999))
            orders = Order.objects.filter(o_id=idd)
            if len(orders) == 0:
                break
        order.o_id = idd
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
        
class OrderFilter(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format="none"):
        data = request.data
        print(data)
        orders = Order.objects.filter(date__gte=data['startdate'],date__lte = data['enddate']).order_by('-date')
        resp = []
        for order in orders:
            client = ClientSerializer(order.client).data
            o = OrderSerializer(order).data
            details = OrderDetailsSerializer(order.orderdetails_set.all(), many=True).data
            resp.append({
                'client':client,
                'order':o,
                'details' : details
            })
            
        return Response(resp,status.HTTP_200_OK)


class EcheanceFilter(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def  get(self,request,format=None):
        invoices =  Invoices.objects.all().order_by('-date')
        ins = InvoiceSerializer(invoices,many=True).data
        return Response(ins,status.HTTP_200_OK)

    def post(self,request,format="none"):
        data = request.data 
        print(data)
        orders = Echeance.objects.filter(dateEcheance__gte=data['startdate'],dateEcheance__lte = data['enddate']).order_by('dateEcheance')
        resp = EcheanceSerializer(orders,many=True).data


        return Response(resp,status.HTTP_200_OK)


class createEchance(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format=None):
        data = request.data 
        print(data)
        e = Echeance.objects.create(name = data['name'],total = float(data['total']),paid = float(data['paid']),reste = float(data['total']) - float(data['paid']),dateEcheance = data['dateEcheance'],type=data['type'])
        e.save()
        return Response(EcheanceSerializer(e).data,status.HTTP_200_OK)

class ModEcheance(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,id,format=None):
        data = request.data 
        print(data)
        e = Echeance.objects.filter(id=id)[0]
        e.total = float(data['total'])
        e.paid = float(data['paid'])
        e.reste = float(data['total']) - float(data['paid'])
        e.dateEcheance = data['dateEcheance']
        e.save()
        return Response(EcheanceSerializer(e).data,status.HTTP_200_OK)

class delEcheance(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,id,format=None):
        e = Echeance.objects.filter(id=id)[0]
        e.delete()
        return Response(EcheanceSerializer(e).data,status.HTTP_200_OK)



class ModOrder(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,format="none"):
        data = request.data
        print(data)
        o = Order.objects.filter(o_id = data['o_id'])[0]
        total = 0
        for d in data['details']:
            total += (d['quantity'] * d['prix'])
            od = o.orderdetails_set.filter(id=d['id'])[0]
            od.quantity = d['quantity']
            od.prix = d['prix']
            od.save()
        print(total)
        c = (total - data['paid']) - (o.total - o.paid)
        print(c)
        client = o.client
        if (client.credit + c == 0):
            client.credit = 0
        else:
            client.credit += c
        client.save()
        o.total = total
        o.paid = data['paid']
        o.mode = data['mode']
        o.save()
        return Response({} , status.HTTP_200_OK)

