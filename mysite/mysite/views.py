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

def error_404_view(request, exception):
    # return HttpResponseNotFound("The page is not found!")
    return render(request, '404.html')

def error_500_view(request):
    return render(request, '500.html')
