from django.db import models
from django.contrib.auth.models import User

class LabelList(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    labelinfo = models.TextField()

    def __str__(self):
        return self.user.username
    
def user_directory_path(instance, filename):
    # 파일이 저장될 경로 "static/images/<username>/<filename>"을 반환
    return 'static/images/{0}/{1}'.format(instance.user.username, filename)

class Photo(models.Model):
    class Meta:
        verbose_name = 'Photo'
        verbose_name_plural = 'Photos'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=user_directory_path, blank=False)
    description = models.TextField()

    def __str__(self):
        return self.image.name[14:]
        