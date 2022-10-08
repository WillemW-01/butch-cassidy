from django.urls import path

from . import views

urlpatterns = [
    path("monthly_items", views.monthly_items),
    path("get_daily_quantities", views.get_daily_quantities),
    path("calculate_sales", views.calculate_sales),
    path("get_monthly_quantities", views.get_monthly_quantities),
    path("get_weekly_quantities", views.get_weekly_quantities),
    path("search_items", views.search_items),
]
