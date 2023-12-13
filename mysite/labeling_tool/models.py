from django.db import models
from django.contrib.auth.models import User
    
class LabelList(models.Model):

    name = models.CharField(max_length=100)
    color = models.CharField(max_length=10)

    def __str__(self):
        return self.name
    
class Photo(models.Model):
    class Meta:
        verbose_name = 'Photo'
        verbose_name_plural = 'Photos'

    image = models.ImageField(null=False, upload_to="static/images/", blank=False)
    description = models.TextField()  # 변경된 부분

    def __str__(self):
        return self.image.name[14:]
        