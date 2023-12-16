from django.forms import ModelForm
from django import forms
from .models import Photo, LabelList

# class FileUploadForm(ModelForm):
#     class Meta:
#         model = FileUpload
#         fields = ['title', 'imgfile', 'content']

        
class FileUploadForm(ModelForm):
    class Meta:
        model = Photo
        fields = ['user', 'image', 'description']
        
        
class LabelListForm(ModelForm):
    class Meta:
        model = LabelList
        fields = ['user', 'labelinfo']
        