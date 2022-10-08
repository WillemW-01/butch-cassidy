from tokenize import group
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

        return JsonResponse({"time": keys, "quantities": values})


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

        return JsonResponse({"time": keys, "quantities": values})


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

        return JsonResponse({"time": keys, "quantities": values})


def calculate_daily_sales(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":
        orders1["Product Price"] = orders1["Quantity"].astype(float) * orders1[
            "Product Price"
        ].astype(float)

        # format to two decimals
        orders1["Order Date"] = pd.to_datetime(orders1["Order Date"]).dt.strftime(
            "%Y-%m-%d"
        )

        ob = orders1.groupby(["Order Date"])["Product Price"].sum().to_dict()

        keys = list(ob.keys())
        values = list(ob.values())
        values = list(np.around(values, 2))

        return JsonResponse({"time": keys, "sales": values})


def calculate_weekly_sales(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":

        orders1["Product Price"] = orders1["Quantity"].astype(float) * orders1[
            "Product Price"
        ].astype(float)

        # format to two decimals
        orders1["Order Date"] = pd.to_datetime(orders1["Order Date"])
        orders1["Weekly"] = orders1["Order Date"].apply(
            lambda x: x - pd.Timedelta(days=x.weekday())
        )
        orders1["Weekly"] = orders1["Weekly"].dt.strftime("%Y-%m-%d")

        ob = orders1.groupby(["Weekly"])["Product Price"].sum().to_dict()

        keys = list(ob.keys())
        values = list(ob.values())
        values = list(np.around(values, 2))

        return JsonResponse({"time": keys, "sales": values})


def calculate_monthly_sales(request):
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

        return JsonResponse({"time": keys, "sales": values})


def search_items(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "POST":

        json_data = json.loads(request.body)
        print(json_data)
        search_key = json_data["search_key"]

        orders1["Item Name"] = orders1["Item Name"][
            orders1["Item Name"].str.lower().str.contains(search_key)
        ]
        grouped = orders1.groupby(["Item Name"])["Quantity"].sum()

        grouped.sort_values(ascending=False, inplace=True)
        grouped = grouped.head(15)
        (keys, values) = zip(*grouped.items())

        return JsonResponse({"items": keys, "quantity": values})


def top_items(request):
    orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
    if request.method == "GET":
        grouped = orders1.groupby(["Item Name"])["Quantity"].sum()
        grouped.sort_values(ascending=False, inplace=True)
        grouped = grouped.head(15)
        (keys, values) = zip(*grouped.items())

        return JsonResponse({"items": keys, "quantity": values})
