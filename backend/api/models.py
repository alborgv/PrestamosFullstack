from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, nit, name, last_name, password=None):
        if not nit:
            raise ValueError("Nit is required")
        if not name or not last_name:
            raise ValueError("Name and/or Last Name is required")

        user = self.model(
            nit=nit,
            name=name,
            last_name=last_name
        )

        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, nit, name, last_name, password=None):
        print(f"Nit: {nit} - Name: {name} - Last Name: {last_name} - Password: {password}")
        user = self.create_user(
            nit,
            name,
            last_name,
            password=password,
        )

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class CustomUser(AbstractBaseUser):

    id = models.AutoField(primary_key=True)
    nit = models.CharField(unique=True, max_length=50, db_index=True)
    name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'nit'
    REQUIRED_FIELDS = ['name', 'last_name']

    def __str__(self):
        return f"{self.name} {self.last_name}"
    
    def has_perm(self, perm, obj=None):
        return True
    
    def has_module_perms(self, app_label):
        return True
    
    def delete(self, using=None, keep_parents=False):
        super().delete()

class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    nit = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    nit_provider = models.ForeignKey(CustomUser, on_delete=models.CASCADE, to_field="nit")

    def __str__(self):
        return f"{self.name} {self.last_name}"
    

class Financial(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='financial_records')
    borrowed = models.CharField(max_length=100)
    credit = models.CharField(max_length=100)
    fee = models.CharField(max_length=100)
    date = models.DateField(default=date.today)
    nit_provider = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='provider', to_field='nit')

    def __str__(self):
        return f"{self.customer.name} {self.customer.last_name}"
    

class Fee(models.Model):
    id = models.AutoField(primary_key=True)
    financial_id = models.ForeignKey(Financial, on_delete=models.CASCADE, related_name="financial_id")
    paid = models.CharField(max_length=100)
    fee_num = models.CharField(max_length=100)
    date = models.DateField()

    def __str__(self):
        return f"{self.financial_id.customer.name} {self.financial_id.customer.last_name} ({self.paid}) [#{self.fee_num}]"
    
    
    # esta monda la hizo chatgpt
    def save(self, *args, **kwargs):
        
        if not self.fee_num:
            last_fee = Fee.objects.filter(financial_id=self.financial_id).order_by('-fee_num').first()
            if last_fee:
                self.fee_num = str(int(last_fee.fee_num) + 1)
            else:
                self.fee_num = '1'
        super().save(*args, **kwargs)