from django.db import models

# Create your models here.
class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=True)
    email = models.CharField(max_length=100, null=True)
    number = models.CharField(max_length=100, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name
    

class Payment(models.Model):
    STATUS = (
        ('Pagado', 'Pagado'),
        ('No pagado', 'No pagado')
    )
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    lened = models.CharField(max_length=100, null=True)
    credit = models.CharField(max_length=100, null=True)
    paid = models.CharField(max_length=100, null=True)
    status = models.CharField(max_length=100, null=True, choices=STATUS)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.customer.name

class Quotas(models.Model):
    
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    payment = models.ForeignKey(Payment, null=True, on_delete=models.SET_NULL)
    times_paid = models.CharField(max_length=100, null=True)
    value = models.CharField(max_length=100, null=True)
    date = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.customer.name