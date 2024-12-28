import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export const WeatherHead = React.memo(({ city, weatherinfo }) => {
  const [celsius, setCelsius] = useState(0);
  const [forecast, setForecast] = useState("Clear");
  const [background, setBackground] = useState("");

  // Choose background based on weather condition
  const backgroundChoose = (condition) => {
    switch (condition) {
      case "Clear":
        return "linear-gradient(to bottom, hsl(205, 82%, 65%), hsl(205, 73%, 100%))";
      case "Clouds":
        return "linear-gradient(to bottom, #808080, #a9a9a9, #c0c0c0, #d3d3d3, #ffffff)";
      case "Atmosphere":
        return "linear-gradient(to bottom, #696969, #808080, #a9a9a9, #d3d3d3, #ffffff)";
      case "Snow":
        return "linear-gradient(to bottom, #ffffff, #e6f7ff, #cceeff, #b3e6ff, #ffffff)";
      case "Rain":
        return "linear-gradient(to bottom, #3a4d8f, #5a6fb5, #7a8fd2, #a0b4ec, #ffffff)";
      case "Drizzle":
        return "linear-gradient(to bottom, #b0c4de, #c6d9ec, #dceeff, #f0f7ff, #ffffff)";
      case "Thunderstorm":
        return "linear-gradient(to bottom, #f1c40f, #f7dc6f, #ffffff)";
      default:
        return "linear-gradient(to bottom, hsl(205, 82%, 65%), hsl(205, 73%, 100%))";
    }
  };

  useEffect(() => {
    if (weatherinfo) {
      setCelsius(Math.floor(weatherinfo.main?.feels_like || 0));
      setForecast(weatherinfo.weather[0]?.main || "Clear");
      setBackground(backgroundChoose(weatherinfo.weather[0]?.main || "Clear"));
    }
  }, [weatherinfo]);

  return (
    <div className="weather-head" style={{ background }}>
      <div className="head-cityandtime">
        <p>{city || "Unknown Location"}</p>
        <div className="head-timeanddate">
          <p className="date">{format(new Date(), "EEEE d")}</p>
          <p className="time">{format(new Date(), "hh:mm a")}</p>
        </div>
      </div>
      <div className="head-celsius">
        <p className="celsius">{celsius}°C</p>
        <b><p className="forecast">{forecast}</p></b>
      </div>
       
    </div>
  );
});
