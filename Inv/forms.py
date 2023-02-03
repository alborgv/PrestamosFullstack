from django import forms
from .models import *

class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'
        labels = {
            'name': 'Nombre',
            'email': 'Email',
            'number': 'Teléfono'
        }
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nombre'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Email',
            }),
            'number': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Teléfono'    
            })
        }

class PaymentForm(forms.ModelForm):
    class Meta:
        model = Payment
        exclude = ('status',)
        fields = '__all__'
        labels = {
            'customer': 'Cliente',
            'lened': 'Prestar',
            'credit': 'Crédito',
            'paid': 'Pagado'
        }
        widgets = {
            'lened': forms.NumberInput(attrs={
                'class': 'form-control'
            }),
            'credit': forms.NumberInput(attrs={
                'class': 'form-control'    
            }),
            'paid': forms.NumberInput(attrs={
                'class': 'form-control'    
            })
        }