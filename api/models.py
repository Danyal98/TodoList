from django.db import models

# Create your models here.
class Tasks(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False, blank=True, null=True)
    creation_date = models.DateField(auto_now_add=True, auto_now=False, blank=False)
    # update_date = models.DateField(auto_now_add=False, auto_now=True, blank=True)

    def __str__(self):
        return self.title