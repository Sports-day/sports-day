export type Weather = {
  weathericon: string;
  weatherinformation: string;
  Color: string;
  type: string;
};
export const weathers: Weather[] = [
  {
    weathericon: "☀️",
    weatherinformation: "晴れ",
    Color: "#FFAA00",
    type: "sunny",
  },
  {
    weathericon: "☔",
    weatherinformation: "雨",
    Color: "#D5D8ED",
    type: "rainy",
  },
];
