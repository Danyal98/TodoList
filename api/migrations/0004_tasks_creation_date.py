# Generated by Django 3.2.12 on 2022-04-09 18:14

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_tasks_creation_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='tasks',
            name='creation_date',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
