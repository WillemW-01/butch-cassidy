from django.urls import path

from . import views

urlpatterns = [
    path("sign_up", views.sign_up),
    path("top_items", views.top_items),
    path("get_daily_quantities", views.get_daily_quantities),
    path("calculate_monthly_sales", views.calculate_monthly_sales),
    path("calculate_daily_sales", views.calculate_daily_sales),
    path("calculate_weekly_sales", views.calculate_weekly_sales),
    path("get_monthly_quantities", views.get_monthly_quantities),
    path("get_weekly_quantities", views.get_weekly_quantities),
    path("search_items", views.search_items),
    path("weekday_popularity", views.weekday_popularity),
    path("average_order", views.average_order),
    path("search_combos", views.search_combos),
    path("best_item", views.best_item),
]
