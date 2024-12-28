import { useEffect, useState } from "react";
import { format, add } from "date-fns";

export const WeatherDetails = ({ weatherinfo, currentdata }) => {
  const [celsius, setCelsius] = useState(18);
  const [wind, setWind] = useState("20.0");
  const [humidity, setHumidity] = useState(96);
  const [temperature, setTemperature] = useState(79);
  const [cor, setCor] = useState(25);
  const [description, setDescription] = useState("Not fetched");
  const [fd, setFd] = useState({
    celsius: [30, 40, 50, 56],
    forecast: ["Cloudy", "Cloudy", "Thunderstorm", "Atmosphere", "Snow"],
  });

  useEffect(() => {
    if (currentdata?.main && currentdata?.weather) {
      setCelsius(Math.floor(currentdata.main.feels_like));
      setWind(
        Math.floor(currentdata.wind.speed) > 9
          ? Math.floor(currentdata.wind.speed)
          : Math.floor(currentdata.wind.speed) + ".0"
      );
      setTemperature(Math.floor(currentdata.main.temp));
      setHumidity(currentdata.main.humidity);
      setDescription(currentdata.weather[0].description);
    }
  }, [currentdata]);

  useEffect(() => {
    if (weatherinfo) {
      const list = weatherinfo.list;
      setFd((p) => ({
        ...p,
        forecast: [
          currentdata.weather[0]?.main,
          list[8]?.weather[0]?.main,
          list[16]?.weather[0]?.main,
          list[24]?.weather[0]?.main,
          list[32]?.weather[0]?.main,
        ],
        celsius: [
          Math.floor(list[8]?.main?.feels_like),
          Math.floor(list[16]?.main?.feels_like),
          Math.floor(list[24]?.main?.feels_like),
          Math.floor(list[32]?.main?.feels_like),
        ],
      }));

      let chanceofrain = 0;
      for (let i = 0; i < 5; i++) {
        chanceofrain += list[i].pop || 0;
      }
      setCor(Math.floor((chanceofrain / 5) * 100));
    }
  }, [weatherinfo]);

  return (
    <div className="details-section">
      
      <p className="det-head"><b>Weather now</b></p>
        
        <div>
            <div className="w-label"><p>Feellike</p><p>Wind&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p></div>
                <div className="w-details"><p>{celsius}&deg;C</p><p>{wind} <span style={{ fontSize: "0.9em" }}>km/h&nbsp;&nbsp;&nbsp;&nbsp;</span></p></div>
            <div className="w-label"><p>Temperature</p><p>Humidity&nbsp;&nbsp;&nbsp;&nbsp;</p></div>
                <div className="w-details"><p>{temperature}&deg;C</p><p>{humidity}%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p></div>
                  <div className="w-label"><p>Chance of rain</p><p >Description</p></div>
                <div className="w-details"><p>{cor}%</p><p style={{width:"110px",whiteSpace: "normal",wordBreak: "normal" }}>{description}</p></div>
                <hr/>
            <div className="w-label1"><p className="prediction-head">Prediction</p><p className="weakly">Weekly</p></div>

        </div>

        <div className="predictions"><p className="prediction-date">Today</p> <p className="prediction-degree">&nbsp;&nbsp;{celsius}&deg;C</p><p className="prediction-forecast">{fd.forecast[0]}</p></div>
        <div className="predictions"><p className="prediction-date">Tommorow</p> <p className="prediction-degree1">&nbsp;{fd.celsius[0]}&deg;C</p><p className="prediction-forecast">{fd.forecast[1]}</p></div>
        <div className="predictions"><p className="prediction-date">{format(add(new Date(),{days:2}),"MMM dd")}</p> <p className="prediction-degree">{fd.celsius[1]}&deg;C</p><p className="prediction-forecast">{fd.forecast[2]}</p></div>
        <div className="predictions"><p className="prediction-date">{format(add(new Date(),{days:3}),"MMM dd")}</p> <p className="prediction-degree">{fd.celsius[2]}&deg;C</p><p className="prediction-forecast">{fd.forecast[3]}</p></div>
        <div className="predictions"><p className="prediction-date">{format(add(new Date(),{days:4}),"MMM dd")}</p> <p className="prediction-degree">{fd.celsius[3]}&deg;C</p><p className="prediction-forecast">{fd.forecast[4]}</p></div>
 
    </div>
  );
};
