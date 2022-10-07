from django.urls import path

from . import views

urlpatterns = [
    path('get_orders', views.get_orders),
    path('monthly_orders', views.monthly_orders),
]