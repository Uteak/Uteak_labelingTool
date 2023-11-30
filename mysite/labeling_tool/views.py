from django.shortcuts import render, redirect
from .forms import FileUploadForm
from .models import FileUpload, Category, Photo, BoundingBox
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def fileUpload(request):
    user = request.user

    #categories = user.category_set.all()

    if request.method == 'POST':
        data = request.POST
        images = request.FILES.getlist('images')

        #if data['category'] != 'none':
        #    category = Category.objects.get(id=data['category'])
        
        # elif data['category_new'] != '':
        #     category, created = Category.objects.get_or_create(
        #         user=user,
        #         name=data['category_new'])
        # else:
        #     category = None

        for image in images:
            photo = Photo.objects.create(
                # category=category,
                description=data['description'],
                image=image,
            )

        return redirect('fileupload')
    
    fileuploadForm = FileUploadForm
    context = {'fileuploadForm': fileuploadForm}
    return render(request, 'fileupload.html', context)

    # if request.method == 'POST':
    #     print(request.POST)
    #     print(request.FILES)
    #     title = request.POST['title']
    #     content = request.POST['content']
    #     img = request.FILES["imgfile"]
    #     fileupload = FileUpload(
    #         title=title,
    #         content=content,
    #         imgfile=img,
    #     )
    #     fileupload.save()
    #     return redirect('fileupload')
    # else:
    #     fileuploadForm = FileUploadForm
    #     context = {
    #         'fileuploadForm': fileuploadForm,
    #     }
    #     return render(request, 'fileupload.html', context)

def image_list_view(request):
    if request.method == 'GET':
        images = Photo.objects.all()
        print(images)
        return render(request, 'scroll.html', {'images': images})
    
def test_view(request):
    if request.method == 'GET':
        images = Photo.objects.all()
        print(images)
        return render(request, 'drawing.html', {'images': images})
    
from django.shortcuts import get_object_or_404
    
def image_slider_view(request):
    if request.method == 'GET':
        images = Photo.objects.all()
        print(images)
        return render(request, 'slider.html', {'images': images})
    
    if request.method == 'POST':
        data = json.loads(request.body)
        image_name = data.get('imageName')
        print(data)
        
        boxinfo = data["boxinfo"]
        infotext = ""
        for key, value in boxinfo.items():
            print(value)
            
            x = float(value["left"][:-2])
            y = float(value["top"][:-2])
            width = float(value["width"][:-2])
            height = float(value["height"][:-2])
            
            nCx = (x + (width * 0.5)) / 800
            nCx = round(nCx, 6)
            nCy = (y + (height * 0.5)) / 500
            nCy = round(nCy, 6)
            nW = width / 800
            nW = round(nW, 6)
            nH = height / 500
            nH = round(nH, 6)
            #print(nCx, nCy, nW, nH)
            infotext += str(nCx) + " " + str(nCy) + " " + str(nW) + " " +  str(nH) + "\n"
        print(infotext)
        image_url = "static/images/" + image_name
        photo = Photo.objects.filter(image=image_url).first()
        print(photo)
        # infoText = ""
        # x, y, width, height = data["left"], data["top"], data["width"], data["height"]
        # nCx = (x + (width * 0.5)) / 800
        # nCx = round(nCx, 6)
        # nCy = (y + (height * 0.5)) / 500
        # nCy = round(nCy, 6)
        # nW = width / 800
        # nW = round(nW, 6)
        # nH = height / 500
        # nH = round(nH, 6)
        
        # print(nCx, nCy, nW, nH)
        # for key, value in data.items():
        #     infoText += str(value)
            
            
        photo.description = infotext
        photo.save()
        print(image_url)

        # print(infoText)
        # print(data)
        # x = data.get('x')
        # y = data.get('y')

        # # 마우스 좌표를 Photo 모델의 description에 저장
        # photo = Photo(description=f"X: {x}, Y: {y}")
        # photo.save()

        return JsonResponse({"status": "success"})


def save_bounding_boxes(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        for box_data in data:
            BoundingBox.objects.create(
                left=box_data['left'],
                top=box_data['top'],
                width=box_data['width'],
                height=box_data['height']
            )
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "failed"})