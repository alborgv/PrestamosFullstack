from django.urls import path
from .import views

urlpatterns = [
    path('', views.dashboard, name = 'Home'),
    
    path('customer/<str:pk_test>/', views.customer, name='Customer'),
    path('create_customer/', views.createCustomer, name='Create_customer'),
    path('edit_customer/<str:pk>/', views.editCustomer, name="Edit_customer"),
    path('list_customers/', views.listCustomers, name='List_customers'),
    path('delete_customer/<str:pk>/', views.deleteCustomer, name='Delete_customer'),
         
    path('payment/<str:pk>/', views.payment, name='Payment'),
    path('create_payment/', views.createPayment, name='Create_payment'),
    path('add_payments/<str:pk>/', views.addPayments, name='Add_payments'),
    path('edit_payment/<str:pk>/', views.editPayment, name='Edit_payment'),
    path('list_payments/', views.listPayments, name='List_payments'),
    path('delete_payment/<str:pk>/', views.deletePayment, name='Delete_payment'),

]