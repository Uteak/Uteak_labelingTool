from django.shortcuts import render, redirect
from .forms import FileUploadForm
from .models import Photo, LabelList
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

import os
import zipfile
from django.conf import settings
from io import BytesIO

def upload_file(request):
    if request.method == 'POST':
        uploaded_files = request.FILES.getlist('files')
        images = [file for file in uploaded_files if file.content_type.startswith('image/')]
        text_files = {file.name.split('.')[0]: file for file in uploaded_files if file.content_type == 'text/plain'}

        for image in images:
            image_base_name = image.name.split('.')[0]
            description = ''
            if image_base_name in text_files:
                description_file = text_files[image_base_name]
                description = description_file.read().decode('utf-8')
            
            photo = Photo(image=image, description=description)
            photo.save()

        return render(request, 'upload_success.html')
    else:
        return render(request, 'fileupload.html')

def download_all_descriptions(request):
    # Create a zip file in memory
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED, False) as zip_file:
        for photo in Photo.objects.all():
            # Name for the individual text file
            file_name = photo.image.name
            if ".jpg" in file_name:
                file_name = file_name.split(".jpg")[0]
            elif ".png" in file_name:
                file_name = file_name.split(".png")[0]
            elif ".PNG" in file_name:
                file_name = file_name.split(".PNG")[0]
            elif ".JPG" in file_name:
                file_name = file_name.split(".JPG")[0]
                
            filename = f"{file_name}.txt"
            # Add file to zip
            zip_file.writestr(filename, photo.description)
    
    # Set pointer to the beginning of the stream
    zip_buffer.seek(0)

    # Create a HttpResponse with zip content
    response = HttpResponse(zip_buffer, content_type='application/zip')
    # Set the HTTP header for downloading
    response['Content-Disposition'] = 'attachment; filename="boxinfomation.zip"'
    
    return response
    
    return response

def lablelist_upload(request):
    
    defualtcolor =  [ "#FF0000", "#0000FF", "#00FF00", "#FF00FF", "#D8F781", "#8A4B08", "#FE9A2E" ,
                     "#0B610B", "#00FFFF", "#8000FF", "#DF01D7", "#610B21", "#1C1C1C", "#F7FE2E",
                      "#2F0B3A", "#8A2908", "#2A1B0A", "#190710", "#819FF7", "#0B6121"]
    
    if request.method == 'GET':
        Labellist = LabelList.objects.all()
        return render(request, 'uploadlabellist.html', {'labellist' : Labellist})
        
    if request.method == 'POST':
        
        label_data = request.POST.get('labelData')
        label_data = json.loads(label_data)       
        labellist = [[] for _ in range(len(label_data))]

        
        for key, index in label_data.items():
            labelName = key
            color =  defualtcolor[index % len(defualtcolor)]
            labellist[index] = [labelName, color]
            
        LabelList.objects.all().delete()
        for labelName, labelcolor in labellist:
            
            labellist_data = LabelList(name=labelName, color=labelcolor)
            labellist_data.save()

        print(labellist)


    return render(request, 'uploadlabellist.html')
    
def labeling_view(request):
    if request.method == 'GET':
        images = Photo.objects.all()
        labelList = LabelList.objects.all()
        print(images)
        print(labelList)
        return render(request, 'labeling_view.html', {'images': images, 'labelList': labelList})
    
    if request.method == 'POST':
        data = json.loads(request.body)
        image_name = data.get('imageName')
        print(data)
        imagepageWidth = float(data['imagepageWidth'])
        imagepageHeight = float(data['imagepageHeight'])
        boxinfo = data["boxinfo"]
        infotext = ""
        print(imagepageWidth, imagepageHeight)
        for key, value in boxinfo.items():
            print(value)
            labelindex = int(value["labelindex"])
            x = float(value["left"][:-2])
            y = float(value["top"][:-2])
            width = float(value["width"][:-2])
            height = float(value["height"][:-2])

            nCx = (x + (width * 0.5)) / imagepageWidth
            nCx = round(nCx, 6)
            nCy = (y + (height * 0.5)) / imagepageHeight
            nCy = round(nCy, 6)
            nW = width / imagepageWidth
            nW = round(nW, 6)
            nH = height / imagepageHeight
            nH = round(nH, 6)
            #print(nCx, nCy, nW, nH)
            infotext += str(labelindex) + " " + str(nCx) + " " + str(nCy) + " " + str(nW) + " " +  str(nH) + "\n"
            
        print(infotext)
        image_url = "static/images/" + image_name
        photo = Photo.objects.filter(image=image_url).first()
        print(photo)     
            
        photo.description = infotext
        photo.save()
        print(image_url)

        return JsonResponse({"status": "success"})
