from django.db import models
import django.utils.timezone
from django.contrib.auth.models import User
# Create your models here.
# class ImageWithLabels (models.Model):
#     # image
#     image = models.ImageField(blank=True)

#     # labels
#     labels = models.ForeignKey(lt_models.Labels, models.CASCADE, related_name='image')


# class DextrTask (models.Model):
#     creation_timestamp = models.DateTimeField(default=django.utils.timezone.now)
#     image = models.ForeignKey(ImageWithLabels, models.CASCADE)
#     image_id_str = models.CharField(max_length=128)
#     dextr_id = models.IntegerField()
#     celery_task_id = models.CharField(max_length=128)