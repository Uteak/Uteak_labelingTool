from django.forms import ModelForm
from django import forms
from .models import FileUpload, Photo, LabelList

# class FileUploadForm(ModelForm):
#     class Meta:
#         model = FileUpload
#         fields = ['title', 'imgfile', 'content']

        
class FileUploadForm(ModelForm):
    class Meta:
        model = Photo
        fields = ['category', 'image', 'description']
        
        
class LabelListForm(ModelForm):
    class Meta:
        model = LabelList
        fields = ['name', 'color']