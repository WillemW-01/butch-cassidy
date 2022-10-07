from django.urls import path

from . import views

urlpatterns = [
    path('get_orders', views.get_orders),
]