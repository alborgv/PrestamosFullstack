from django.contrib import admin
from .models import CustomUser, Customer, Financial, Fee

admin.site.register(CustomUser)
admin.site.register(Customer)
admin.site.register(Financial)
admin.site.register(Fee)