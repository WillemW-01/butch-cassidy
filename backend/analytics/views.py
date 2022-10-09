from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
import numpy as np
import calendar
from datetime import datetime, date, timedelta
import holidays
import lightgbm as lgb
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_absolute_error

main_orders = pd.DataFrame()
main_prices = pd.DataFrame()
p_quants = pd.DataFrame()
f_quants = pd.DataFrame()
p_sales = pd.DataFrame()
f_sales = pd.DataFrame()
p_orders = pd.DataFrame()
f_orders = pd.DataFrame()


@csrf_exempt
def sign_up(request):
    if request.method == "POST":
        global main_orders, main_prices, p_quants, f_quants, p_sales, f_sales, p_orders, f_orders
    
        json_data = json.loads(request.body)
        name = json_data["restaurant"]

        # if name.lower() == "blue billie jeans":
        #     main_orders = pd.read_csv("../data/restaurant-1-orders.csv")
        #     main_prices = pd.read_csv("../data/restaurant-1-products-price.csv")
        # elif name.lower() == "red butter bus":
        #     main_orders = pd.read_csv("../data/restaurant-2-orders.csv")
        #     main_prices = pd.read_csv("../data/restaurant-2-products-price.csv")

        main_orders = pd.read_csv("../data/restaurant-1-orders.csv")
        main_prices = pd.read_csv("../data/restaurant-1-products-price.csv")

        #################
        # Quantities
        #################

        orders = main_orders.copy(deep=True)

        orders["Order Date"] = pd.to_datetime(orders["Order Date"]).dt.strftime(
            "%Y-%m-%d"
        )
        orders = orders.sort_values(by="Order Date", ascending=True)

        start_date = orders["Order Date"].iloc[0]
        end_date = orders["Order Date"].iloc[-1]

        grouped = orders.groupby(orders["Order Date"])["Quantity"].sum()

        date_range = pd.date_range(start_date, end_date, freq="D")
        column = []
        for date in date_range:
            d = date.strftime("%Y-%m-%d")
            if d in grouped.index:
                column.append(grouped[d])
            else:
                column.append(0)
        dic = {"date": date_range, "quantity": column}
        p_quants = pd.DataFrame(dic)
        p_quants = p_quants.set_index(p_quants.date)
        p_quants.drop("date", axis=1, inplace=True)

        f_quants = predict(p_quants)

        #################
        # Sales
        #################

        orders = main_orders.copy(deep=True)

        orders["Order Date"] = pd.to_datetime(orders["Order Date"]).dt.strftime(
            "%Y-%m-%d"
        )
        orders = orders.sort_values(by="Order Date", ascending=True)

        start_date = orders["Order Date"].iloc[0]
        end_date = orders["Order Date"].iloc[-1]

        orders["sales"] = orders["Product Price"] * orders["Quantity"]

        grouped = orders.groupby(orders["Order Date"])["sales"].sum()

        date_range = pd.date_range(start_date, end_date, freq="D")
        column = []
        for date in date_range:
            d = date.strftime("%Y-%m-%d")
            if d in grouped.index:
                column.append(grouped[d])
            else:
                column.append(0)
        dic = {"date": date_range, "quantity": column}
        p_sales = pd.DataFrame(dic)
        p_sales = p_sales.set_index(p_sales.date)
        p_sales.drop("date", axis=1, inplace=True)

        f_sales = predict(p_sales)

        #################
        # Orders
        #################

        orders = main_orders.copy(deep=True)

        orders["Order Date"] = pd.to_datetime(orders["Order Date"]).dt.strftime(
            "%Y-%m-%d"
        )
        orders = orders.sort_values(by="Order Date", ascending=True)

        start_date = orders["Order Date"].iloc[0]
        end_date = orders["Order Date"].iloc[-1]
 
        orders = orders[['Order Number', 'Order Date']].drop_duplicates(subset=['Order Number'], keep='first')
        orders = orders['Order Date']
        grouped = orders.value_counts().sort_index()

        date_range = pd.date_range(start_date, end_date, freq="D")
        column = []
        for date in date_range:
            d = date.strftime("%Y-%m-%d")
            if d in grouped.index:
                column.append(grouped[d])
            else:
                column.append(0)
        dic = {"date": date_range, "quantity": column}
        p_orders = pd.DataFrame(dic)
        p_orders = p_orders.set_index(p_orders.date)
        p_orders.drop("date", axis=1, inplace=True)

        f_orders = predict(p_orders)

        return JsonResponse({"success":True})


def get_daily_quantities(request):
    if request.method == "GET":
        global p_quants, f_quants

        keys = list(p_quants.index.strftime("%Y-%m-%d")) + list(
            f_quants.index.strftime("%Y-%m-%d")
        )
        values = list(p_quants.quantity) + list(round(f_quants.quantity, 1))

        return JsonResponse(
            {
                "time": keys,
                "quantities": values,
                "predict_start": f_quants.index[0].strftime("%Y-%m-%d"),
            }
        )


def get_weekly_quantities(request):
    if request.method == "GET":
        global p_quants, f_quants

        p = p_quants.copy(deep=True)
        f = f_quants.copy(deep=True)

        p["date"] = p.index
        p["week"] = p["date"].apply(lambda x: x - pd.Timedelta(days=x.weekday()))
        p["week"] = p["week"].dt.strftime("%Y-%m-%d")
        p["quantity"] = p["quantity"].astype(int)
        p = p.groupby(["week"])["quantity"].sum()

        f["date"] = f.index
        f["week"] = f["date"].apply(lambda x: x - pd.Timedelta(days=x.weekday()))
        f["week"] = f["week"].dt.strftime("%Y-%m-%d")
        f["quantity"] = f["quantity"].astype(int)
        f = f.groupby(["week"])["quantity"].sum()

        pvals = [int(x) for x in p.values]
        fvals = [float(round(x, 1)) for x in f.values]

        keys = list(p.index) + list(f.index)
        values = list(pvals) + list(fvals)

        return JsonResponse(
            {
                "time": keys,
                "quantities": values,
                "predict_start": f_quants.index[0].strftime("%Y-%m-%d"),
            }
        )


def get_monthly_quantities(request):
    if request.method == "GET":
        global p_quants, f_quants

        p = p_quants.copy(deep=True)
        f = f_quants.copy(deep=True)

        p["date"] = p.index
        p["month"] = p["date"].apply(lambda x: x - pd.Timedelta(days=x.day - 1))
        p["month"] = p["month"].dt.strftime("%Y-%m")
        p["quantity"] = p["quantity"].astype(int)
        p = p.groupby(["month"])["quantity"].sum()

        f["date"] = f.index
        f["month"] = f["date"].apply(lambda x: x - pd.Timedelta(days=x.day - 1))
        f["month"] = f["month"].dt.strftime("%Y-%m")
        f["quantity"] = f["quantity"].astype(int)
        f = f.groupby(["month"])["quantity"].sum()

        pvals = [int(x) for x in p.values]
        fvals = [float(round(x, 1)) for x in f.values]

        keys = list(p.index) + list(f.index)
        values = list(pvals) + list(fvals)

        return JsonResponse(
            {
                "time": keys,
                "quantities": values,
                "predict_start": f_quants.index[0].strftime("%Y-%m-%d"),
            }
        )


def calculate_daily_sales(request):
    if request.method == "GET":
        global p_sales, f_sales

        keys = list(p_sales.index.strftime("%Y-%m-%d")) + list(
            f_sales.index.strftime("%Y-%m-%d")
        )

        values = list(p_sales.quantity) + list(round(f_sales.quantity, 1))

        return JsonResponse(
            {
                "time": keys,
                "sales": values,
                "predict_start": f_quants.index[0].strftime("%Y-%m-%d"),
            }
        )


def calculate_weekly_sales(request):
    if request.method == "GET":
        global p_sales, f_sales

        p = p_sales.copy(deep=True)
        f = f_sales.copy(deep=True)

        p["date"] = p.index
        p["week"] = p["date"].apply(lambda x: x - pd.Timedelta(days=x.weekday()))
        p["week"] = p["week"].dt.strftime("%Y-%m-%d")
        p["quantity"] = p["quantity"].astype(int)
        p = p.groupby(["week"])["quantity"].sum()

        f["date"] = f.index
        f["week"] = f["date"].apply(lambda x: x - pd.Timedelta(days=x.weekday()))
        f["week"] = f["week"].dt.strftime("%Y-%m-%d")
        f["quantity"] = f["quantity"].astype(int)
        f = f.groupby(["week"])["quantity"].sum()

        pvals = [int(x) for x in p.values]
        fvals = [float(round(x, 1)) for x in f.values]

        keys = list(p.index) + list(f.index)
        values = list(pvals) + list(fvals)

        return JsonResponse(
            {
                "time": keys,
                "sales": values,
                "predict_start": f_quants.index[0].strftime("%Y-%m-%d"),
            }
        )


def calculate_monthly_sales(request):
    if request.method == "GET":
        global p_sales, f_sales

        p = p_sales.copy(deep=True)
        f = f_sales.copy(deep=True)

        p["date"] = p.index
        p["month"] = p["date"].apply(lambda x: x - pd.Timedelta(days=x.day - 1))
        p["month"] = p["month"].dt.strftime("%Y-%m")
        p["quantity"] = p["quantity"].astype(int)
        p = p.groupby(["month"])["quantity"].sum()

        f["date"] = f.index
        f["month"] = f["date"].apply(lambda x: x - pd.Timedelta(days=x.day - 1))
        f["month"] = f["month"].dt.strftime("%Y-%m")
        f["quantity"] = f["quantity"].astype(int)
        f = f.groupby(["month"])["quantity"].sum()

        pvals = [int(x) for x in p.values]
        fvals = [float(round(x, 1)) for x in f.values]

        keys = list(p.index) + list(f.index)
        values = list(pvals) + list(fvals)

        return JsonResponse(
            {
                "time": keys,
                "sales": values,
                "predict_start": f_quants.index[0].strftime("%Y-%m-%d"),
            }
        )


# def search_combos(request){
#     if request.method == "GET":
#         # group items names with orders

#         # count repeated items with that order
# }


@csrf_exempt
def search_items(request):
    if request.method == "POST":
        global main_orders

        json_data = json.loads(request.body)
        search_key = json_data["key"]

        orders = main_orders.copy(deep=True)

        orders["Item Name"] = orders["Item Name"][
            orders["Item Name"].str.lower().str.contains(search_key)
        ]
        grouped = orders.groupby(["Item Name"])["Quantity"].sum()

        grouped.sort_values(ascending=False, inplace=True)
        grouped = grouped.head(15)
        (keys, values) = zip(*grouped.items())

        return JsonResponse({"items": keys, "quantity": values})


def top_items(request):
    if request.method == "GET":
        global main_orders

        orders = main_orders.copy(deep=True)

        grouped = orders.groupby(["Item Name"])["Quantity"].sum()
        grouped.sort_values(ascending=False, inplace=True)
        (keys, values) = zip(*grouped.items())

        return JsonResponse({"items": keys, "quantity": values})


def weekday_popularity(request):
    if request.method == "GET":
        global main_orders

        orders = main_orders.copy(deep=True)

        # find assign weekday to order_date
        orders["Order Date"] = pd.to_datetime(orders["Order Date"])
        orders["Weekday"] = orders["Order Date"].apply(
            lambda x: calendar.day_name[x.weekday()]
        )

        # group by weekday and sum quantity
        grouped = orders.groupby(["Weekday"])["Quantity"].sum()
        (keys, values) = zip(*grouped.items())

        return JsonResponse({"weekdays": keys, "quantity": values})


def average_order(request):
    if request.method == "GET":
        global main_orders

        orders = main_orders.copy(deep=True)

        orders["Order Number"] = orders["Order Number"]
        grouped_quantity = orders.groupby(["Order Number"])["Quantity"].sum()
        average_quantity = grouped_quantity.mean()
        orders["Product Price"] = orders["Quantity"].astype(float) * orders[
            "Product Price"
        ].astype(float)
        grouped_sales = orders.groupby(["Order Number"])["Product Price"].sum()
        # (keys, values) = zip(*grouped_sales.items())
        # return JsonResponse({"order_number": keys, "quantity": values})
        average_quantity = round((grouped_quantity.mean()), 2)
        average_sales = round((grouped_sales.mean()), 2)
        return JsonResponse({"average": average_quantity, "sales": average_sales})


def expected_orders_today(request):
     if request.method == "GET":
        global f_orders

        f = f_orders.copy(deep=True)

        f.index = f.index.strftime("%m-%d")
        tod = date.today().strftime('%m-%d')

        return JsonResponse({'prediction':float(round(f.loc[tod], 1))})


def expected_orders_change(request):
     if request.method == "GET":
        global f_orders

        f = f_orders.copy(deep=True)

        f.index = f.index.strftime("%m-%d")

        tod = date.today().strftime('%m-%d')
        tom = (date.today() + timedelta(days=1)).strftime("%m-%d")
        
        change = round((float(f.loc[tom])-float(f.loc[tod]))/float(f.loc[tod])*100, 1)

        return JsonResponse({'change':change})


def predict(Y_train):
    weather = pd.read_csv("../data/london_weather.csv")

    # Get start and end Date of input
    p_start_date = Y_train.index[0].strftime("%Y%m%d")
    p_end_date = Y_train.index[-1].strftime("%Y%m%d")

    f_start_date = Y_train.index[-1] + timedelta(days=1)
    f_end_date = f_start_date + timedelta(days=365)

    f_start_date = f_start_date.strftime("%Y%m%d")
    f_end_date = f_end_date.strftime("%Y%m%d")

    # Match Weather data to this timeframe
    weather.date = weather.date.astype(str)

    prev_weather = weather[weather["date"] >= p_start_date]
    prev_weather = prev_weather[weather["date"] <= p_end_date]

    fut_weather = weather[weather["date"] >= f_start_date]
    fut_weather = fut_weather[weather["date"] <= f_end_date]  # add one year

    # Change date column type to datetime
    prev_weather.date = pd.to_datetime(prev_weather.date)
    fut_weather.date = pd.to_datetime(fut_weather.date)

    # Clean Data
    prev_weather = prev_weather.drop(
        ["global_radiation", "pressure", "snow_depth"], axis=1
    )
    prev_weather_cols = prev_weather.columns[1:]
    for col in prev_weather_cols:
        prev_weather[col].fillna(
            (prev_weather.groupby([prev_weather.date.dt.month])[col].transform("mean")),
            inplace=True,
        )

    fut_weather = fut_weather.drop(
        ["global_radiation", "pressure", "snow_depth"], axis=1
    )
    fut_weather_cols = fut_weather.columns[1:]
    for col in fut_weather_cols:
        fut_weather[col].fillna(
            (fut_weather.groupby([fut_weather.date.dt.month])[col].transform("mean")),
            inplace=True,
        )

    # Compile past Data for Training
    p_date_range = pd.date_range(p_start_date, p_end_date, freq="D")

    p_day = p_date_range.day

    p_week = p_date_range.week

    p_month = p_date_range.month

    p_year = p_date_range.year

    p_weekday = [x.weekday() for x in p_date_range]  # monday = 0

    p_season = [get_season(x) for x in p_date_range]

    past_holidays = []
    for ptr in holidays.UnitedKingdom(
        years=[x for x in range(int(p_start_date[:4]), int(p_end_date[:4]) + 1)]
    ).items():
        past_holidays.append(ptr[0].strftime("%Y-%m-%d"))

    p_holiday = []
    for date in p_date_range:
        if date.strftime("%Y-%m-%d") in past_holidays:
            p_holiday.append(1)
        else:
            p_holiday.append(0)
    p_season = [int(x) for x in p_season]

    # Create training set
    dic = {
        "date": p_date_range,
        "day": p_day,
        "week": p_week,
        "month": p_month,
        "year": p_year,
        "weekday": p_weekday,
        "season": p_season,
        "holiday": p_holiday,
        "cloud_cover": prev_weather["cloud_cover"],
        "sunshine": prev_weather["sunshine"],
        "max_temp": prev_weather["max_temp"],
        "mean_temp": prev_weather["mean_temp"],
        "min_temp": prev_weather["min_temp"],
        "precipitation": prev_weather["precipitation"],
    }

    X_train = pd.DataFrame(dic)
    X_train = X_train.set_index(X_train.date)
    X_train.drop("date", axis=1, inplace=True)

    # Compile future Data for Predictions
    f_date_range = pd.date_range(f_start_date, f_end_date, freq="D")

    f_day = f_date_range.day

    f_week = f_date_range.week

    f_month = f_date_range.month

    f_year = f_date_range.year

    f_weekday = [x.weekday() for x in f_date_range]  # monday = 0

    f_season = [get_season(x) for x in f_date_range]

    past_holidays = []
    for ptr in holidays.UnitedKingdom(
        years=[x for x in range(int(f_start_date[:4]), int(f_end_date[:4]) + 1)]
    ).items():
        past_holidays.append(ptr[0].strftime("%Y-%m-%d"))

    f_holiday = []
    for date in f_date_range:
        if date.strftime("%Y-%m-%d") in past_holidays:
            f_holiday.append(1)
        else:
            f_holiday.append(0)
    f_season = [int(x) for x in f_season]

    # Create prediction set
    dic = {
        "date": f_date_range,
        "day": f_day,
        "week": f_week,
        "month": f_month,
        "year": f_year,
        "weekday": f_weekday,
        "season": f_season,
        "holiday": f_holiday,
        "cloud_cover": fut_weather["cloud_cover"],
        "sunshine": fut_weather["sunshine"],
        "max_temp": fut_weather["max_temp"],
        "mean_temp": fut_weather["mean_temp"],
        "min_temp": fut_weather["min_temp"],
        "precipitation": fut_weather["precipitation"],
    }

    X_predict = pd.DataFrame(dic)
    X_predict = X_predict.set_index(X_predict.date)
    X_predict.drop("date", axis=1, inplace=True)

    # Train and Predict
    model = LGBMRegressor(random_state=42)
    model.fit(X_train, Y_train)
    predictions = model.predict(X_predict)

    # Prepare data to return
    quantity = [x if x > 0 else 0 for x in predictions]  # no negatives
    df = pd.DataFrame({"date": f_date_range, "quantity": quantity})
    df = df.set_index(df.date)
    df.drop("date", axis=1, inplace=True)

    # df_importances = pd.DataFrame({
    # 'feature': model.feature_name_,
    # 'importance': model.feature_importances_
    # }).sort_values(by='importance', ascending=False)

    return df # df_importances.to_dict('records')


def get_season(now):
    d = now.strftime("%m%d")
    if d >= "0101" and d <= "0320":  # winter
        return 0
    elif d >= "0321" and d <= "0620":  # spring
        return 1
    elif d >= "0621" and d <= "0922":  # summer
        return 2
    elif d >= "0923" and d <= "1220":  # autumn
        return 3
    elif d >= "1221" and d <= "1231":  # winter
        return 0
