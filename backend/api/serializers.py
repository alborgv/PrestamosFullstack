from .models import CustomUser, Customer, Financial, Fee
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import TokenError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['nit'] = user.nit
        token['name'] = user.name
        token['last_name'] = user.last_name

        return token

class LoginSerializer(serializers.Serializer):
    nit = serializers.CharField()
    password = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('nit', 'name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn'tt match."})

        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create(
            nit=validated_data['nit'],
            name=validated_data['name'],
            last_name=validated_data['last_name']

        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    old_password = serializers.CharField(required=True, error_messages={"blank": "Este campo es requerido."})
    new_password = serializers.CharField(required=True, error_messages={"blank": "Este campo es requerido."})
    new_password_confirm = serializers.CharField(required=True, error_messages={"blank": "Este campo es requerido."})

    def validate(self, data):
        token = data.get('token')
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        new_password_confirm = data.get('new_password_confirm')


        if token:
            try:
                refresh_token = RefreshToken(token)
                user = CustomUser.objects.get(id=refresh_token["user_id"])
            except TokenError as e:
                print("ERROR:", e)
                raise serializers.ValidationError(e)

        print(user, old_password, new_password, new_password_confirm)
        
        if not user.check_password(old_password):
            raise serializers.ValidationError({'old_password': 'La contraseña antigua es incorrecta.'})

        if new_password != new_password_confirm:
            raise serializers.ValidationError({'new_password_confirm': 'Las nuevas contraseñas no coinciden.'})

        if old_password == new_password:
            raise serializers.ValidationError({'new_password': 'La nueva contraseña debe ser diferente de la antigua.'})

        return data
    

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'nit', 'name', 'last_name', 'phone', 'email', 'nit_provider')


        
class CreateCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('nit', 'name', 'last_name', 'phone', 'email', 'nit_provider')

    def create(self, validated_data):
        customer = Customer.objects.create(
            nit=validated_data['nit'],
            name=validated_data['name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone'],
            email=validated_data['email'],
            nit_provider=validated_data['nit_provider']

        )


        return customer
    

class FinancialSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_last_name = serializers.SerializerMethodField()
    customer_nit = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    fees = serializers.SerializerMethodField()

    class Meta:
        model = Financial
        fields = ['id', 'customer_nit', 'customer_name', 'customer_last_name', 'customer_email', 'customer_phone', 'fees', 'borrowed', 'credit', 'fee', 'date', 'nit_provider']

    def get_customer_name(self, obj):
        return obj.customer.name

    def get_customer_last_name(self, obj):
        return obj.customer.last_name
    
    def get_customer_nit(self, obj):
        return obj.customer.nit
    
    def get_customer_email(self, obj):
        return obj.customer.email
    
    def get_customer_phone(self, obj):
        return obj.customer.phone
    
    def get_fees(self, obj):
        fees = Fee.objects.filter(financial_id=obj)
        return FeeSerializer(fees, many=True).data


class CreateFinancialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Financial
        fields = ('customer', 'borrowed', 'credit', 'fee', 'nit_provider')

    def create(self, validated_data):
        financial = Financial.objects.create(
            customer=validated_data['customer'],
            borrowed=validated_data['borrowed'],
            credit=validated_data['credit'],
            fee=validated_data['fee'],
            nit_provider=validated_data['nit_provider']

        )

        return financial
    

class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = ('id', 'financial_id', 'paid', 'fee_num', 'date')


class CreateFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = ('financial_id', 'paid', 'date')

    def create(self, validated_data):
        fee = Fee.objects.create(
            financial_id=validated_data["financial_id"],
            paid=validated_data["paid"],
            date=validated_data["date"]
        )

        return fee