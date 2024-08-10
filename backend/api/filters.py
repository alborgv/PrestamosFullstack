
import django_filters
from .models import Customer, Financial

class CustomerFilter(django_filters.FilterSet):
    class Meta:
        model = Customer
        fields = {
            'nit_provider': ['exact'],
        }


class FinancialFilter(django_filters.FilterSet):
    class Meta:
        model = Financial
        fields = {
            'nit_provider': ['exact'],
        }