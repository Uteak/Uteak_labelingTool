from django.contrib import admin

from .models import (
    Photo,
    LabelList
)

admin.site.register(Photo)
admin.site.register(LabelList)
