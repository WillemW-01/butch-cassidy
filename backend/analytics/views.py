from django.shortcuts import render
from django.http import JsonResponse

import json
import pandas as pd
import numpy as np

orders = pd.read_csv('../data/restaurant-1-orders.csv')
# res_2_orders = pd.read_csv('../data/restaurant-2-orders.csv')
products_price = pd.read_csv('../data/restaurant-1-products-price.csv')
# res_2_products_price = pd.read_csv('../data/restaurant-2-products-price.csv')

def sign_up(request):
    if request.method == 'GET':  
        
        return JsonResponse(orders.to_dict('records'), safe=False)

def get_orders(request):
    if request.method == 'GET':  
        o = pd.to_datetime(orders['Order Date']).dt.strftime('%m,%d,%Y')
        return JsonResponse(o.to_dict('records'), safe=False)

def monthly_orders(request):
    if request.method == 'GET':  
        o = orders[['Order Number', 'Order Date']].drop_duplicates(subset=['Order Number'], keep='first')
        o['Order Date'] = pd.to_datetime(o['Order Date'])
        o = o.sort_values(by='Order Date', ascending=True)
        o = o['Order Date'].dt.strftime('%Y,%m')
        # o = o.groupby(['Order Date']).count()
        counts = o.value_counts().sort_index().to_dict()

        keys = list(counts.keys())
        values = list(counts.values())
        (keys,values) = zip(*counts.items())

        return JsonResponse({'month':keys, "orders":values})

        # 13397
