# Generated by Django 5.2 on 2025-06-30 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Fornecedor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cnpj', models.CharField(max_length=18, unique=True)),
                ('razao_social', models.CharField(max_length=200)),
                ('fantasia', models.CharField(max_length=100)),
            ],
        ),
    ]
