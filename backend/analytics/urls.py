from django.urls import path

from . import views

urlpatterns = [
    path("monthly_items", views.monthly_items),
    path("get_daily_quantities", views.get_daily_quantities),
    path("calculate_sales", views.calculate_sales),
]
