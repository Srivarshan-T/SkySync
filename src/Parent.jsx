import { useState, useEffect } from "react";
import { WeatherHead } from "./WeatherHead";
import { WeatherDetails } from "./WeatherDetails";

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export const Parent = () => {
  const [showHead, setShowHead] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 550);
  const [fullLocation, setFullLocation] = useState("Fetching location..");
  const [weatherinfo, setWeatherinfo] = useState();
  const [currentdata, setCurrentdata] = useState();

  const current = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      setCurrentdata(data);
    } catch (error) {
      console.error("Error fetching current weather data:", error);
    }
  };

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherinfo(data);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  async function checkWeatherData(city) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.cod === 200; // Return true if valid weather data exists
    } catch (error) {
      console.error("Error checking weather data:", error);
      return false;
    }
  }

  function getFullLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude,accuracy } = pos.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          fetch(url)
            .then((res) => res.json())
            .then(async (data) => {
              const address = data.address;
              const city = address.city || address.town || address.village || "";
              const state = address.state || "";
              console.log(city, state,"acurracy:",accuracy);

              if (city) {
                const hasCityData = await checkWeatherData(city);
                if (hasCityData) {
                  setFullLocation(city);
                } else {
                  console.warn(`Weather data unavailable for city: ${city}`);
                  setFullLocation(state); // Fallback to state
                }
              } else {
                setFullLocation(state);
              }
            })
            .catch((error) => console.error("Error fetching location:", error));
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    } else {
      setFullLocation("Unable to fetch the location");
    }
  }
  useEffect(() => {
    getFullLocation();
  }, []);

  useEffect(() => {
    if (fullLocation !== "Fetching location..") {
      search(fullLocation);
      current(fullLocation);
    }
  }, [fullLocation]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - 10) {
        setShowHead(false);
        setShowToggleButton(true);
      } else if (scrollPosition < pageHeight - 100) {
        setShowHead(true);
        setShowToggleButton(false);
      }
    }, 200);

    if (isMobile) {
      window.addEventListener("scroll", handleScroll);
    } else {
      setShowHead(true);
      setShowToggleButton(false);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 550);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleHead = () => {
    setShowHead(true);
    setShowToggleButton(false);
  };
if (currentdata){ return (
  <div>
    {showHead && <WeatherHead city={fullLocation} weatherinfo={currentdata} />}
    <div>
      {showToggleButton && (
        <button onClick={toggleHead} className="toggle-head-btn" aria-label="Show Weather Head">
          ^
        </button>
      )}
      <WeatherDetails weatherinfo={weatherinfo} currentdata={currentdata} />
    </div>
  </div>
);}
else{
  return(/* From Uiverse.io by zanina-yassine */ 
    <div class="container">
      <div class="cloud front">
        <span class="left-front"></span>
        <span class="right-front"></span>
      </div>
      <span class="sun sunshine"></span>
      <span class="sun"></span>
      <div class="cloud back">
        <span class="left-back"></span>
        <span class="right-back"></span>

      </div>
      <div className="alert">Please Turn On The Location And<p className="alert"> Refresh The Page</p></div>
    </div>)
}
 
};
