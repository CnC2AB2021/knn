import pandas as pd
from sklearn.preprocessing import StandardScaler

data = pd.read_csv("data.csv", skiprows=1)
data.drop("Food code", axis=1)
data_num = data.select_dtypes(include='number')
data_norm = (data_num - data_num.mean()) / (data_num.max() - data_num.min())
data[data_norm.columns] = data_norm


# Find unique categories of data
categories = data["WWEIA Category description"].unique()



for row in categories:

    category_data : pd.DataFrame = data.loc[data["WWEIA Category description"] == row]
    category_median : pd.DataFrame = category_data.median(numeric_only=True)

    other_data : pd.DataFrame = data.loc[data["WWEIA Category description"] != row]
    other_median : pd.DataFrame = other_data.median(numeric_only=True)

    diff = category_median.sub(other_median).abs()

    print(row)
    print(diff.nlargest(1))
    pass
