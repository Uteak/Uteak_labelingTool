from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

# added app namespace
# app_name = 'image'

urlpatterns = [
    path('image_upload/', views.upload_file, name='fileupload'),
    path('labelList_upload/', views.lablelist_upload, name='labelupload'),
    path('image_slider/', views.labeling_view, name='imgfile'),
    path('image_control/', views.image_control_view, name='image_control'),
    path('download/all-descriptions/', views.download_all_descriptions, name='download_all_descriptions'),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)