# Generated by Django 4.2.6 on 2023-12-03 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labeling_tool', '0005_alter_photo_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='LabelList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=10)),
            ],
        ),
    ]