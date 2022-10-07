from django.shortcuts import render
from django.http import JsonResponse

import json
import pandas as pd
import numpy as np

orders1 = pd.read_csv("../data/restaurant-1-orders.csv")
orders2 = pd.read_csv("../data/restaurant-2-orders.csv")
products_price1 = pd.read_csv("../data/restaurant-1-products-price.csv")
products_price2 = pd.read_csv("../data/restaurant-2-products-price.csv")


def sign_up(request):
    if request.method == "GET":

        return JsonResponse(orders1.to_dict("records"), safe=False)


def get_orders(request):
    if request.method == "GET":
        o = pd.to_datetime(orders1["Order Date"]).dt.strftime("%m,%d,%Y")
        return JsonResponse(o.to_dict("records"), safe=False)


def monthly_orders1(request):
    if request.method == "GET":
        # o = orders[["Order ID", "Order Date"]].drop_duplicates(
        #     subset=["Order ID"], keep="first"
        # )
        o = orders1[["Order Number", "Order Date"]].drop_duplicates(
            subset=["Order Number"], keep="first"
        )
        o["Order Date"] = pd.to_datetime(o["Order Date"])
        o = o.sort_values(by="Order Date", ascending=True)
        o = o["Order Date"].dt.strftime("%Y-%m")
        # o = o.groupby(['Order Date']).count()
        counts = o.value_counts().sort_index().to_dict()

        keys = str(list(counts.keys()))
        values = list(counts.values())

        (keys, values) = zip(*counts.items())

        return JsonResponse({"month": keys, "orders": values})


def monthly_orders2(request):
    if request.method == "GET":
        o = orders2[["Order ID", "Order Date"]].drop_duplicates(
            subset=["Order ID"], keep="first"
        )
        o["Order Date"] = pd.to_datetime(o["Order Date"])
        o = o.sort_values(by="Order Date", ascending=True)
        o = o["Order Date"].dt.strftime("%Y-%m")
        # o = o.groupby(['Order Date']).count()
        counts = o.value_counts().sort_index().to_dict()

        keys = str(list(counts.keys()))
        values = list(counts.values())

        (keys, values) = zip(*counts.items())

        return JsonResponse({"month": keys, "orders": values})


def monthly_items(request):
    if request.method == "GET":

        # get most popular items from orders1
        o1 = orders1[["Item Name", "Quantity"]]
        counts1 = o1["Item Name"].value_counts().sort_index().to_dict()

        (keys1, values1) = zip(*counts1.items())

        # get most popular items from orders2
        # o2 = orders2[["Item Name", "Quantity"]]
        # counts2 = o2["Item Name"].value_counts().sort_index().to_dict()

        # (keys2, values2) = zip(*counts2.items())

        # return JsonResponse(
        #     {"month": keys1, "orders": values1, "month2": keys2, "orders2": values2}
        # )

        return JsonResponse({"Item": keys1, "Quantity": values1})

        # return JsonResponse({'month': keys1, 'orders': values1, 'month2': keys2, 'orders2': values2})
