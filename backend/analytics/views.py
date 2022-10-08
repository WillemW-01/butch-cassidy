from django.shortcuts import render
from django.http import JsonResponse

import json
import pandas as pd
import numpy as np

# orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
# orders2 = pd.read_csv("../data/restaurant-2-orders.csv")
# products_price1 = pd.read_csv("../data/restaurant-1-products-price.csv")
# products_price2 = pd.read_csv("../data/restaurant-2-products-price.csv")


def sign_up(request):
    if request.method == "GET":

        return JsonResponse(orders1.to_dict("records"), safe=False)


def get_daily_quantities(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":
        o = orders1.copy(deep=True)
        o["Order Date"] = pd.to_datetime(o["Order Date"]).dt.strftime("%Y-%m-%d")
        o["Quantity"] = o["Quantity"].astype(int)
        o = o.groupby(["Order Date"])["Quantity"].sum().to_dict()

        keys = str(list(o.keys()))
        values = list(o.values())

        (keys, values) = zip(*o.items())

        return JsonResponse({"day": keys, "quantities": values})


def get_monthly_quantities(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":
        o = orders1.copy(deep=True)
        o["Order Date"] = pd.to_datetime(o["Order Date"]).dt.strftime("%Y-%m")
        o["Quantity"] = o["Quantity"].astype(int)
        o = o.groupby(["Order Date"])["Quantity"].sum().to_dict()

        keys = str(list(o.keys()))
        values = list(o.values())

        (keys, values) = zip(*o.items())

        return JsonResponse({"month": keys, "quantities": values})


def get_weekly_quantities(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":
        o = orders1.copy(deep=True)
        o["Order Date"] = pd.to_datetime(o["Order Date"])
        o["Weekly"] = o["Order Date"].apply(
            lambda x: x - pd.Timedelta(days=x.weekday())
        )
        o["Weekly"] = o["Weekly"].dt.strftime("%Y-%m-%d")
        o["Quantity"] = o["Quantity"].astype(int)
        o = o.groupby(["Weekly"])["Quantity"].sum().to_dict()

        keys = str(list(o.keys()))
        values = list(o.values())

        (keys, values) = zip(*o.items())

        return JsonResponse({"week": keys, "quantities": values})


def calculate_sales(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":
        orders1["Product Price"] = orders1["Quantity"].astype(float) * orders1[
            "Product Price"
        ].astype(float)

        # format to two decimals
        orders1["Order Date"] = pd.to_datetime(orders1["Order Date"]).dt.strftime(
            "%Y-%m"
        )

        ob = orders1.groupby(["Order Date"])["Product Price"].sum().to_dict()

        keys = list(ob.keys())
        values = list(ob.values())
        values = list(np.around(values, 2))

        return JsonResponse({"month": keys, "sales": values})


def monthly_items(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":

        grouped = orders1.groupby(["Item Name"])["Quantity"].sum()
        (keys, values) = zip(*grouped.items())

        return JsonResponse({"items": keys, "quantity": values})
