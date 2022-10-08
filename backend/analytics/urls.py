from django.urls import path

from . import views

urlpatterns = [
    path("get_orders", views.get_orders),
    path("monthly_orders1", views.monthly_orders1),
    path("monthly_orders2", views.monthly_orders2),
    path("monthly_items", views.monthly_items),
    path("get_daily_orders", views.get_daily_orders),
    path("get_daily_quantities", views.get_daily_quantities),
]
