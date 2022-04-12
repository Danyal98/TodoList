from django.urls import path
from First_Site import views


urlpatterns = [
    path('', views.index, name = "home"),
    path('about/', views.about, name = "about"),
    path('services/', views.services, name = "services"),
    path('contact/', views.contact, name = "contact"),
    
    # path('', include('base.urls')),
]
