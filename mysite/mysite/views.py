from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
import os, datetime, json, tempfile, zipfile
import requests

from django.http.response import HttpResponse
import celery.result
from PIL import Image

from dateutil.tz import tzlocal

from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction
from django.db.models import Q
from django.core.files import File

from django.conf import settings
import django.utils.timezone

from . import models, tasks, forms

def index(request):
    # pass
    # return HttpResponse("main index")
    return render(request, 'index.html')

@ensure_csrf_cookie
# def upload_images(request):
#     if request.method == 'POST':
#         upload_form = forms.ImageUploadForm(request.POST, request.FILES)

#         if upload_form.is_valid():
#             uploaded_file = upload_form.cleaned_data['file']

#             print(uploaded_file.content_type)

#             if uploaded_file.content_type in {'image/jpeg', 'image/png'}:
#                 # Single image upload

#                 # Blank labels
#                 labels_model = lt_models.Labels(creation_date=datetime.date.today())
#                 labels_model.save()

#                 image_model = models.ImageWithLabels(labels=labels_model)
#                 image_model.image.save(os.path.basename(uploaded_file.name), uploaded_file)
#                 image_model.save()
#             elif uploaded_file.content_type in {'application/zip', 'application/x-zip-compressed'}:
#                 # ZIP file

#                 # Write to a temporary file
#                 handle, upload_path =tempfile.mkstemp()
#                 os.close(handle)
#                 os.remove(upload_path)

#                 with open(upload_path, 'wb+') as f_dest:
#                     for chunk in uploaded_file.chunks():
#                         f_dest.write(chunk)

#                 # Load the ZIP and get its contents
#                 z = zipfile.ZipFile(upload_path, 'r')

#                 # Pair image files with corresponding label files
#                 name_to_image_and_labels = {}
#                 for filename_and_ext in z.namelist():
#                     filename, ext = os.path.splitext(filename_and_ext)
#                     if ext.lower() in {'.png', '.jpg', '.jpeg'}:
#                         entry = name_to_image_and_labels.setdefault(filename, dict(image=None, labels=None))
#                         entry['image'] = filename_and_ext
#                     elif ext.lower() == '.json':
#                         if filename.endswith('__labels'):
#                             filename = filename[:-8]
#                         entry = name_to_image_and_labels.setdefault(filename, dict(image=None, labels=None))
#                         entry['labels'] = filename_and_ext

#                 # Add all images using a single transaction
#                 with transaction.atomic():
#                     for name, entry in name_to_image_and_labels.items():
#                         # Entry is only valid if there is an image file
#                         if entry['image'] is not None:
#                             valid_image = False
#                             # Attempt to open the image to ensure its valid
#                             with z.open(entry['image'], mode='r') as f_img:
#                                 try:
#                                     im = Image.open(f_img)
#                                 except IOError:
#                                     pass
#                                 else:
#                                     valid_image = True
#                                     im.close()

#                             if valid_image:
#                                 labels_model = None
#                                 # See if we have a labels file
#                                 if entry['labels'] is not None:
#                                     # Open the labels
#                                     with z.open(entry['labels'], mode='r') as f_labels:
#                                         try:
#                                             wrapped_labels = json.load(f_labels)
#                                         except IOError:
#                                             pass
#                                         else:
#                                             # Get the modification date and time of the labels file
#                                             z_info = z.getinfo(entry['labels'])
#                                             year, month, day, hour, minute, second = z_info.date_time
#                                             creation_date = datetime.date(
#                                                 year=year, month=month, day=day)
#                                             modification_datetime = datetime.datetime(
#                                                 year=year, month=month, day=day, hour=hour, minute=minute,
#                                                 second=second, tzinfo=tzlocal())
#                                             if request.user.is_authenticated:
#                                                 modification_user = request.user
#                                             else:
#                                                 modification_user = None

#                                             # Unwrap the labels
#                                             labels, complete = labelling_tool.PersistentLabelledImage._unwrap_labels(
#                                                 wrapped_labels)
#                                             complete = complete if isinstance(complete, bool) else False

#                                             # Build labels model
#                                             labels_model = lt_models.Labels(
#                                                 labels_json_str=json.dumps(labels), complete=complete,
#                                                 creation_date=creation_date,
#                                                 last_modified_datetime=modification_datetime,
#                                                 last_modified_by=modification_user)
#                                             labels_model.save()

#                                 if labels_model is None:
#                                     # No labels loaded; create an empty labels model
#                                     labels_model = lt_models.Labels(creation_date=datetime.date.today())
#                                     labels_model.save()

#                                 image_model = models.ImageWithLabels(labels=labels_model)
#                                 image_model.image.save(os.path.basename(entry['image']),
#                                                        File(z.open(entry['image'], mode='r')))
#                                 image_model.save()
#             else:
#                 # Unknown type; put message in session
#                 request.session['example_labeller_message'] = 'unknown_upload_filetype'
#     return redirect('example_labeller:home')

def error_404_view(request, exception):
    # return HttpResponseNotFound("The page is not found!")
    return render(request, '404.html')

def error_500_view(request):
    return render(request, '500.html')
