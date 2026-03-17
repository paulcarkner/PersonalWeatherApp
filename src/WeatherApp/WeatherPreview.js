import Style from "./WeatherPreview.module.css";
import React from "react";
import WeatherIcon from "./WeatherIcon";
import WeatherTemp from "./WeatherTemp";
import { fetchForecast } from "./Utils/Weather.js";

//small group showing weather icon and temperature for given weather data or location
export default class WeatherPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: this.props.weather,
    };
  }

  componentDidMount() {
    if (!this.state.weather) {
      //if not given weather data, fetch current weather for given lat/lon
      fetchForecast(
        this.props.location.lat,
        this.props.location.lon,
        "minutely,hourly,daily,alerts"
      ).then((data) => this.setState({ weather: data }));
    }
  }

  render() {
    return (
      <div className={Style.weatherPreview}>
        <WeatherIcon
          className={Style.previewIcon}
          weatherCode={this.state.weather?.current?.weather[0]?.id}
          size="1.4em"
          time={this.state.weather?.current?.dt}
          timezone={this.state.weather?.timezone_offset}
        />
        <WeatherTemp
          className={Style.previewTemp}
          temp={this.state.weather?.current?.temp}
          decimals={1}
        />
      </div>
    );
  }
}
