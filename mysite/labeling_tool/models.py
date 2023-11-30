from django.db import models
from django.contrib.auth.models import User

    
class FileUpload(models.Model):
    title = models.TextField(max_length=40, null=True)
    imgfile = models.ImageField(null=True, upload_to="static/images/", blank=False)
    content = models.TextField()

    def __str__(self):
        return self.title
    
    
class Category(models.Model):
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100, null=False, blank=False)

    def __str__(self):
        return self.name

class Photo(models.Model):
    class Meta:
        verbose_name = 'Photo'
        verbose_name_plural = 'Photos'
    
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(null=False, upload_to="static/images/", blank=False)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.image.name[14:]
    
class BoundingBox(models.Model):
    left = models.FloatField()
    top = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()