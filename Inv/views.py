from django.shortcuts import render, redirect
from .forms import *
from .models import *

from django.core.paginator import Paginator

# Create your views here.
def dashboard(request):
    payments = Payment.objects.all().filter(status='No pagado')

    context = {
        'payments': payments
    }
    return render(request, 'Inv/dashboard.html', context)


# CUSTOMERS
def customer(request, pk_test):
    #customer = Customer.objects.get(id=pk_test)
    customer = Customer.objects.get(id=pk_test)
    payments = Payment.objects.filter(customer = pk_test)
    all_payments = payments.count()

    context = {
        'pk': pk_test,
        'customer': customer,
        'payments': payments,
        'all_payments': all_payments
    }

    return render(request, 'Inv/customer.html', context)


def createCustomer(request):
    form = CustomerForm()
    
    print(form.visible_fields())

    if request.method == "POST":
        form = CustomerForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/')
    context = {
        'form': form
    }
    return render(request, 'Inv/customer_create.html', context)

def editCustomer(request, pk):
    customer = Customer.objects.get(id=pk)
    form = CustomerForm(instance=customer)
    if request.method == "POST":
        form = CustomerForm(request.POST, instance=customer)
        if form.is_valid():
            if int(customer.lened) >= int(customer.paid):
                customer.category = 'No Pagado'
            elif int(customer.lened) <= int(customer.paid):
                customer.category = 'Pagado'
            form.save()
            return redirect('/')
    

    context = {
        'customer': customer,
        'form': form
    }

    return render(request, 'Inv/customer_create.html', context)


def deleteCustomer(request, pk):
    customer = Customer.objects.get(id=pk)
    if request.method == "POST":
        customer.delete()
        return redirect('/')
    
    context = {
        'customer': customer
    }
    return render(request, 'Inv/delete_customer.html', context)


def listCustomers(request):
    customers_list = Customer.objects.all()

    p = Paginator(customers_list, 4)
    page = request.GET.get('page')
    customers = p.get_page(page)
    nums = customers.paginator.num_pages

    context = {
        'customers_list': customers_list,
        'customers': customers,
        'nums': nums
    }

    return render(request, 'Inv/list_customers.html', context)


# PAYMENTS
def payment(request, pk):
    payment = Payment.objects.get(id=pk)
    pys = Payment.objects.filter(customer=payment.customer)
    all_payments = pys.count()

    quotas = Quotas.objects.filter(payment=payment)
    count = quotas.count()

    total = int(payment.lened) + int(payment.credit)
    rest = total - int(payment.paid)
        

    context = {
        'all_payments': all_payments,
        'payment': payment,
        'quotas': quotas,
        'count': count,
        'total': total,
        'rest': rest
    }

    return render(request, 'Inv/payment.html', context)

def createPayment(request):
    form = PaymentForm()
    if request.method == "POST":
        form = PaymentForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/')
    
    context = {
        'form': form
    }
    return render(request, 'Inv/create_payment.html', context)

def addPayments(request, pk):
    payment = Payment.objects.get(id=pk)
    form = CustomerForm(instance=payment)
    if request.method == "POST":
        form = CustomerForm(request.POST, instance=payment)

        pay = request.POST['pay']
        value = payment.paid
        total = int(pay) + int(value)
        total_to_pay = int(payment.lened) + int(payment.credit)

        if total >= total_to_pay:
            payment.status = 'Pagado'
        else:
            payment.status = 'No pagado'

        payment.paid = total
        payment.save()
        
        pys = Quotas.objects.filter(payment=payment)
        count = pys.count()

        if count == 0:
            count = 1
        else:
            count = int(count) + 1

        quotas = Quotas.objects.create(customer=payment.customer, payment=payment, times_paid=count, value=pay)
        
        return redirect('/')

    context = {
        'customer': customer,
        'form': form
    }
    return render(request, 'Inv/add_payments.html', context)


def editPayment(request, pk):
    payment = Payment.objects.get(id=pk)
    form = PaymentForm(instance=payment)

    if request.method =="POST":
        form = PaymentForm(request.POST, instance=payment)

        if form.is_valid():
            
            value = int(payment.paid)
            total_to_pay = int(payment.lened) + int(payment.credit)

            if value >= total_to_pay:
                payment.status = 'Pagado'
            else:
                payment.status = 'No pagado'
            form.save()
            return redirect('/')

    context = {
        'payment': payment,
        'form': form
    }

    return render(request, 'Inv/create_payment.html', context)

def deletePayment(request, pk):
    payment = Payment.objects.get(id=pk)
    quotas = Quotas.objects.filter(payment=payment)
    count = quotas.count()

    total = int(payment.lened) + int(payment.credit)
    rest = total - int(payment.paid)
    if request.method == "POST":
        payment.delete()
        return redirect('/')
    
    context = {
        'payment': payment,
        'quotas': quotas,
        'count': count,
        'total': total,
        'rest': rest
    }
    return render(request, 'Inv/delete_payment.html', context)
    
def listPayments(request):
    payments_list = Payment.objects.all()

    p = Paginator(payments_list, 4)
    page = request.GET.get('page')
    payments = p.get_page(page)
    nums = payments.paginator.num_pages

    context = {
        'payments_list': payments_list,
        'payments': payments,
        'nums': nums
    }

    return render(request, 'Inv/list_payments.html', context)
