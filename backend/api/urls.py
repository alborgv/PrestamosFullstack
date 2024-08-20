from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from .views import *

urlpatterns = [
    path('login/', LoginAPI.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('customer/', CustomerView.as_view(), name='customer'),
    path('create_customer/', CreateCustomerView.as_view(), name='create_customer'),
    path('customer/<int:pk>/update/', CustomerUpdateView.as_view(), name='customer-update'),
    path('customer/<int:pk>/delete/', DeleteCustomerView.as_view(), name='delete_customer'),
    path('financials/', FinancialView.as_view(), name='financials'),
    path('create_financial/', CreateFinancialView.as_view(), name='create_financial'),
    path('financials/<int:pk>/delete/', DeleteFinancialView.as_view(), name='financial-delete'),
    path('create_fee/', CreateFeeView.as_view(), name='create_fee'),
]
