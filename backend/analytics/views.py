from django.shortcuts import render
from django.http import JsonResponse

import json
import pandas as pd

res_1_orders = pd.read_csv('../data/restaurant-1-orders.csv')
res_2_orders = pd.read_csv('../data/restaurant-2-orders.csv')
res_1_products_price = pd.read_csv('../data/restaurant-1-products-price.csv')
res_2_products_price = pd.read_csv('../data/restaurant-2-products-price.csv')

def get_orders(request):
    if request.method == 'GET':  
        
        return JsonResponse(res_1_orders.to_dict('records'), safe=False)

