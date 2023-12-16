# Generated by Django 4.2.6 on 2023-12-16 06:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('labeling_tool', '0010_remove_labellist_color_remove_labellist_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labellist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, unique=True),
        ),
    ]