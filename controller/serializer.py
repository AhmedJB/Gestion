from django.db.models.base import Model
from rest_framework.serializers import ModelSerializer
from .models import CustomUser,Product,Provider,Options



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
        fields = ['id','name','email','phone','address','date']
        


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','p_id','name','ptype','price_vente','price_achat','quantity']

class OptionsSerializer(ModelSerializer):
    class Meta:
        model = Options
        fields = ['id','metal','type']


