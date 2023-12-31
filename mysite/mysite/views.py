from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.http.response import HttpResponse
from PIL import Image

from dateutil.tz import tzlocal

from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction
from django.db.models import Q
from django.core.files import File

from django.conf import settings
from django.shortcuts import render, redirect
from .forms import SignUpForm
from django.contrib.auth import login, authenticate, logout

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('home')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  # 로그인 성공 시 리다이렉트할 페이지
        else:
            # 로그인 실패 시 처리
            return render(request, 'login.html', {'error': 'Invalid login'})
    else:
        return render(request, 'login.html')

def user_logout(request):
    logout(request)
    return redirect('home')  # 로그아웃 후 리다이렉트할 페이지

def description_page(request):
    return render(request, 'description.html')

def index(request):
    # pass
    # return HttpResponse("main index")
    return render(request, 'index.html')

def error_404_view(request, exception):
    # return HttpResponseNotFound("The page is not found!")
    return render(request, '404.html')

def error_500_view(request):
    return render(request, '500.html')
