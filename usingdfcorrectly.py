import pandas as pd
from sklearn.preprocessing import StandardScaler

data = pd.read_csv("data.csv", skiprows=1)
data = data.drop(["Food code", "WWEIA Category number"], axis=1)
data_num = data.select_dtypes(include='number')
data_norm = (data_num - data_num.mean()) / (data_num.std())
data[data_norm.columns] = data_norm


# Find unique categories of data
categories = data["WWEIA Category description"].unique()


biggest_things : dict[str, int] = {}


for row in categories:

    category_data : pd.DataFrame = data.loc[data["WWEIA Category description"] == row]
    category_median : pd.DataFrame = category_data.mean(numeric_only=True)

    other_data : pd.DataFrame = data.loc[data["WWEIA Category description"] != row]
    other_median : pd.DataFrame = other_data.mean(numeric_only=True)

    diff = category_median.sub(other_median).abs()

    importantest : pd.Series = diff.nlargest(3)

    print(f"{row}")
    i = 3
    for key, value in importantest.items():
        if not key in biggest_things.keys():
            biggest_things[key] = 0
        biggest_things[key] += i
        i -= 1
        print(f"     {key}: {value}")

print(dict(sorted(biggest_things.items(), key=lambda item: item[1])))
