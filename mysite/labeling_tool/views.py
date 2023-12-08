from django.shortcuts import render, redirect
from .forms import FileUploadForm
from .models import FileUpload, Category, Photo, BoundingBox, LabelList
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
        print(label_data, type(label_data))
        print(labellist)
        
        for i, (key, index) in enumerate(label_data.items()):
            labelName = key
            print(index, type(index))
            color =  defualtcolor[index % len(defualtcolor)]
            labellist[index] = [labelName, color]
            
        LabelList.objects.all().delete()
        for labelName, labelcolor in labellist:
            
            labellist_data = LabelList(name=labelName, color=labelcolor)
            labellist_data.save()

        print(labellist)


    return render(request, 'uploadlabellist.html')
    
def image_slider_view(request):
    if request.method == 'GET':
        images = Photo.objects.all()
        labelList = LabelList.objects.all()
        print(images)
        print(labelList)
        return render(request, 'slider.html', {'images': images, 'labelList': labelList})
    
    if request.method == 'POST':
        data = json.loads(request.body)
        image_name = data.get('imageName')
        print(data)
        
        boxinfo = data["boxinfo"]
        infotext = ""
        for key, value in boxinfo.items():
            print(value)
            labelindex = int(value["labelindex"])
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
            infotext += str(labelindex) + " " + str(nCx) + " " + str(nCy) + " " + str(nW) + " " +  str(nH) + "\n"
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