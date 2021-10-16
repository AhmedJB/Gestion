from django.db.models.base import Model
from rest_framework.serializers import ModelSerializer
from .models import CustomUser,Product,Provider,Options,Invoices,Client,Order,OrderDetails,Echeance



class RegisterSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email','password']
        extra_kwargs = {'password': {'write_only':True}}

    def create(self,validated,*args,**kwargs):
        u = CustomUser.objects.create(username = validated['username'],email=validated['email'])
        u.set_password(validated['password'])
        u.save()

        return RegisterSerializer(u).data




class ProviderSerializer(ModelSerializer):
    class Meta:
        model = Provider
        fields = ['id','name','email','credit','phone','address','date']

class ClientSerializer(ModelSerializer):
    class Meta:
        model = Client
        fields = ['id','name','email','credit','phone','address','date']
        
class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ['id','total','paid','mode','o_id','date']

class OrderDetailsSerializer(ModelSerializer):
    class Meta:
        model = OrderDetails
        fields = ['id','product_name','quantity','prix','prix_achat','provider_id','product_id']


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','p_id','name','paid','ptype','price_vente','price_achat','quantity']

class OptionsSerializer(ModelSerializer):
    class Meta:
        model = Options
        fields = ['id','metal','type']


class  InvoiceSerializer(ModelSerializer):
    class Meta:
        model = Invoices
        fields = ['id','f_id','path','date']

class EcheanceSerializer(ModelSerializer):
    class Meta:
        model = Echeance
        fields = ['id','name','total','paid','reste','dateEcheance','date']

