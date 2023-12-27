from django.shortcuts import render, redirect
from .forms import FileUploadForm
from .models import Photo, LabelList
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

import os
import zipfile
from django.conf import settings
from io import BytesIO

@login_required
def upload_file(request):
    
    if request.method == 'GET':
        # images = Photo.objects.all()
        # labelList = LabelList.objects.all()
        # print(labelList)
        user_images = Photo.objects.filter(user=request.user)
        user_labels = LabelList.objects.filter(user=request.user)
        
        imageName_list = []
        for image in user_images:
            imageName = str(image).split('/')[1]
            imageName_list.append(imageName)
        
        labelinfoList = []
        for label in user_labels:
            labelinfos = label.labelinfo.split('\n')
            
            for info in labelinfos:
                if not info:
                    continue
                labelname, labelcolor = info.split()
                labelinfoList.append([labelname, labelcolor])

        userid = request.user
        return render(request, 'fileupload.html', {'images': imageName_list, 'labelList': labelinfoList, 'userid' : userid})
    
    if request.method == 'POST':
        
        if 'form_type' in request.POST and request.POST['form_type'] == 'upload_files':
            uploaded_files = request.FILES.getlist('files')
            images = [file for file in uploaded_files if file.content_type.startswith('image/')]
            text_files = {file.name.split('.')[0]: file for file in uploaded_files if file.content_type == 'text/plain'}

            for image in images:
                image_base_name = image.name.split('.')[0]
                description = ''
                if image_base_name in text_files:
                    description_file = text_files[image_base_name]
                    description = description_file.read().decode('utf-8')

                photo = Photo(user=request.user, image=image, description=description)
                photo.save()

            return render(request, 'upload_success.html')
        
        elif 'form_type' in request.POST and request.POST['form_type'] == 'image_control':
            image_ids = request.POST.getlist('image_ids')
        
            for imageName in image_ids:
                image_id = "static/images/" + str(request.user) + "/" + imageName
                image_delete = Photo.objects.filter(image=image_id)
                image_delete.delete()

                file_path = os.path.join(settings.MEDIA_ROOT, image_id)
                if os.path.isfile(file_path):
                    os.remove(file_path)

            #Photo.objects.filter(image=image_idList).delete()
            return redirect('fileupload')
    else:
        return render(request, 'fileupload.html')

def download_all_descriptions(request):
    # Create a zip file in memory
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED, False) as zip_file:
        for photo in Photo.objects.all():
            # Name for the individual text file
            file_name = photo.image.name
            
            folder_name = os.path.dirname(file_name)
            folder_name = folder_name[14:]
            if ".jpg" in file_name:
                file_name = file_name.split(".jpg")[0]
            elif ".png" in file_name:
                file_name = file_name.split(".png")[0]
            elif ".PNG" in file_name:
                file_name = file_name.split(".PNG")[0]
            elif ".JPG" in file_name:
                file_name = file_name.split(".JPG")[0]
            
            if str(folder_name) == str(request.user):
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


def lablelist_upload(request):
    
    defualtcolor =  [ "#FF0000", "#0000FF", "#00FF00", "#FF00FF", "#D8F781", "#8A4B08", "#FE9A2E" ,
                     "#0B610B", "#00FFFF", "#8000FF", "#DF01D7", "#610B21", "#1C1C1C", "#F7FE2E",
                      "#2F0B3A", "#8A2908", "#2A1B0A", "#190710", "#819FF7", "#0B6121"]
    
    if request.method == 'GET':
        user_labels = LabelList.objects.filter(user=request.user)
        
        labelinfoList = []
        for label in user_labels:
            labelinfos = label.labelinfo.split('\n')
            
            for info in labelinfos:
                if not info:
                    continue
                labelname, labelcolor = info.split()
                labelinfoList.append([labelname, labelcolor])
        
        userid = request.user
        return render(request, 'uploadlabellist.html', {'labellist' : labelinfoList, 'userid' : userid})
        
    if request.method == 'POST':
        
        label_data = request.POST.get('labelData')
        label_data = json.loads(label_data)       
        labellist = []

        
        for i in range(len(label_data)):
            labelName = label_data[i]
            color =  defualtcolor[i % len(defualtcolor)]
            labellist.append([labelName, color])
            
        labeltext = ""
        for labelName, labelcolor in labellist:
            labeltext += labelName + " " + labelcolor + '\n'
        
        existing_labellist = LabelList.objects.filter(user=request.user)

        # 기존 객체가 존재하면 삭제
        if existing_labellist.exists():
            existing_labellist.delete()

        # 새 LabelList 객체 생성 및 저장
        new_labellist = LabelList(user=request.user, labelinfo=labeltext)
        new_labellist.save()
        return render(request, 'upload_success.html')
    
    return render(request, 'uploadlabellist.html')
    
def labeling_view(request):
    if request.method == 'GET':
        # images = Photo.objects.all()
        # labelList = LabelList.objects.all()
        # print(labelList)
        user_images = Photo.objects.filter(user=request.user)
        user_labels = LabelList.objects.filter(user=request.user)
        
        labelinfoList = []
        for label in user_labels:
            labelinfos = label.labelinfo.split('\n')
            
            for info in labelinfos:
                if not info:
                    continue
                labelname, labelcolor = info.split()
                labelinfoList.append([labelname, labelcolor])

        userid = request.user
        return render(request, 'labeling_view.html', {'images': user_images, 'labelList': labelinfoList, 'userid': userid})
    
    if request.method == 'POST':
        data = json.loads(request.body)
        image_name = data.get('imageName')
        imagepageWidth = float(data['imagepageWidth'])
        imagepageHeight = float(data['imagepageHeight'])
        boxinfo = data["boxinfo"]
        infotext = ""

        for key, value in boxinfo.items():
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
        
        image_url = "static/images/" + str(request.user) + "/" + image_name
        photo = Photo.objects.filter(image=image_url).first()
            
        photo.description = infotext
        photo.save()

        return JsonResponse({"status": "success"})


# def image_control_view(request):
    
#     if request.method == 'POST':
#         image_ids = request.POST.getlist('image_ids')
        
#         for imageName in image_ids:
#             image_id = "static/images/" + str(request.user) + "/" + imageName
#             image_delete = Photo.objects.filter(image=image_id)
#             image_delete.delete()
            
#             file_path = os.path.join(settings.MEDIA_ROOT, image_id)
#             if os.path.isfile(file_path):
#                 os.remove(file_path)
            
#         #Photo.objects.filter(image=image_idList).delete()
#         return redirect('image_control')
    
#     if request.method == 'GET':
#         # images = Photo.objects.all()
#         # labelList = LabelList.objects.all()
#         # print(labelList)
#         user_images = Photo.objects.filter(user=request.user)
#         user_labels = LabelList.objects.filter(user=request.user)
        
#         imageName_list = []
#         for image in user_images:
#             imageName = str(image).split('/')[1]
#             imageName_list.append(imageName)
        
#         labelinfoList = []
#         for label in user_labels:
#             labelinfos = label.labelinfo.split('\n')
            
#             for info in labelinfos:
#                 if not info:
#                     continue
#                 labelname, labelcolor = info.split()
#                 labelinfoList.append([labelname, labelcolor])

#         return render(request, 'image_control.html', {'images': imageName_list, 'labelList': labelinfoList})
    