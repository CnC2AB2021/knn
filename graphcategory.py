import pandas as pd
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

data = pd.read_csv("data.csv", skiprows=1)
data = data.drop(["Food code", "WWEIA Category number"], axis=1)

nutrient = "MUFA 22:1 (g)"

fig, ax = plt.subplots()
ax.scatter(nutrient, "WWEIA Category description", data=data, c=['r' if v=="Cream and cream substitutes" else 'b' for v in data["WWEIA Category description"]])
ax.set(xlabel=nutrient, ylabel='Category')

plt.show()