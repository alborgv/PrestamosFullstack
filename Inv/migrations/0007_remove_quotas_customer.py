# Generated by Django 4.1.5 on 2023-02-01 06:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Inv', '0006_quotas'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quotas',
            name='customer',
        ),
    ]
