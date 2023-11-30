from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

# added app namespace
# app_name = 'image'

urlpatterns = [
    path('image_upload/', views.fileUpload, name='fileupload'),
    path('image_list/', views.image_list_view, name='imgfile'),
    path('image_slider/', views.image_slider_view, name='imgfile'),
    path('test_view/', views.test_view, name='test'),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)