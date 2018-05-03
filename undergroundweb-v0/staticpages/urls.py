from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about', views.about, name='about'),
    path('apply', views.about, name='apply'),
    path('staff', views.about, name='staff'),
]
