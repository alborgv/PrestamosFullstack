from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth import authenticate, logout

from .models import CustomUser, Customer, Financial, Fee
from .authentication import NitJWTAuthentication
from .serializers import *
from .filters import CustomerFilter, FinancialFilter

class LoginAPI(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = [NitJWTAuthentication]

    def post(self, request):

        try:
            data = request.data
            serializer = LoginSerializer(data = data)
            if serializer.is_valid():
                
                nit = serializer.data['nit']
                password = serializer.data['password']

                user = authenticate(request, nit=nit, password=password)
                
                if user is None:
                    return Response({
                        'status': 400,
                        'message': 'invalid credentials',
                        'data': {}
                    })
                
                refresh = RefreshToken.for_user(user)

                return Response({
                    'user': str(nit),
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            
            return Response({
                'status': 400,
                'message': 'someting went wrong',
                'data': serializer.errors
            })
        except Exception as e:
            print(e)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code != status.HTTP_200_OK:
            response.data = {'error': response.data}
        return super().finalize_response(request, response, *args, **kwargs)

class ChangePasswordView(generics.CreateAPIView):
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('token')
        
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                user = CustomUser.objects.get(id=token["user_id"])

                serializer = ChangePasswordSerializer(data=request.data)
                if serializer.is_valid():
                    user.set_password(serializer.validated_data['new_password'])
                    user.save()
                    token.blacklist()
                    return Response({"detail": "Password changed successfully"}, status=status.HTTP_200_OK)
                
                else:
                    print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except (InvalidToken, TokenError) as e:
                print("ERROR:", e)
                return Response(e)


        
class CustomerView(generics.ListAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filterset_class = CustomerFilter

    def get_queryset(self):
        queryset = super().get_queryset()

        nit_provider_param = self.request.query_params.get('nit_provider', None)

        if nit_provider_param is not None:
            queryset = queryset.filter(nit_provider=nit_provider_param)

        return queryset


class CreateCustomerView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CreateCustomerSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code != status.HTTP_200_OK:
            response.data = {'error': response.data}
        return super().finalize_response(request, response, *args, **kwargs)


class CustomerUpdateView(APIView):
    def put(self, request, pk, format=None):
        try:
            customer = Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            return Response({'error': 'Cliente no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteCustomerView(generics.DestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class FinancialView(generics.ListAPIView):
    queryset = Financial.objects.all()
    serializer_class = FinancialSerializer
    filterset_class = FinancialFilter

    def get_queryset(self):
        queryset = super().get_queryset()

        nit_provider_param = self.request.query_params.get('nit_provider', None)

        if nit_provider_param is not None:
            queryset = queryset.filter(nit_provider=nit_provider_param)

        return queryset

class CreateFinancialView(generics.CreateAPIView):
    queryset = Financial.objects.all()
    serializer_class = CreateFinancialSerializer
    
    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code != status.HTTP_200_OK:
            response.data = {'error': response.data}
        return super().finalize_response(request, response, *args, **kwargs)

class DeleteFinancialView(generics.DestroyAPIView):
    queryset = Financial.objects.all()
    serializer_class = FinancialSerializer



class CreateFeeView(generics.CreateAPIView):
    queryset = Fee.objects.all()
    serializer_class = CreateFeeSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code != status.HTTP_200_OK:
            response.data = {'error': response.data}
        return super().finalize_response(request, response, *args, **kwargs)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == "GET":
        response = f"Hey {request.user}, you are seeing a GET response"
        return Response({'response': response}, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        print(str(request.POST))
        text = request.POST.get("text")
        response = f"Hey {request.user}, your text is: {text}"
        return Response({'response': response}, status=status.HTTP_200_OK)
    
    return Response({}, status=status.HTTP_400_BAD_REQUEST)