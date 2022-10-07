from django.db import models

class Restaurant_1_orders(models.Model):
    id = models.AutoField(primary_key=True)
    order_number = models.IntegerField()
    order_date = models.DateTimeField()
    item_name = models.CharField(max_length=128)
    quantity = models.IntegerField()
    product_price = models.FloatField()
    total_products = models.IntegerField()

class Restaurant_1_product_price(models.Model):
    id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=128)
    product_price = models.FloatField()

class Restaurant_2_orders(models.Model):
    id = models.AutoField(primary_key=True)
    order_number = models.IntegerField()
    order_date = models.DateTimeField()
    item_name = models.CharField(max_length=128)
    quantity = models.IntegerField()
    product_price = models.FloatField()
    total_products = models.IntegerField()

class Restaurant_2_product_price(models.Model):
    id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=128)
    product_price = models.FloatField()