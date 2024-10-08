# Generated by Django 5.0.2 on 2024-07-13 20:33

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_customuser_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Financial',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('borrowed', models.CharField(max_length=100)),
                ('credit', models.CharField(max_length=100)),
                ('fee', models.CharField(max_length=100)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='financial_records', to='api.customer')),
                ('nit_provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='provider', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
