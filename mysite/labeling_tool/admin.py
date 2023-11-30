from django.contrib import admin

from .models import (
    FileUpload,
    Category,
    Photo
)

admin.site.register(FileUpload)
admin.site.register(Category)
admin.site.register(Photo)
