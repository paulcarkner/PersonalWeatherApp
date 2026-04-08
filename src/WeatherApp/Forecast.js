import Style from "./Forecast.module.css";
import React from "react";
import WeatherIcon from "./WeatherIcon";
import WeatherTemp from "./WeatherTemp";
import LineChart from "./LineChart";
import ForecastDetail from "./ForecastDetail";
import { processTemp, UNIXtoDateTime, getUTCTime } from "./Utils/Weather.js";

export default class Forecast extends React.Component {
  render() {
    return (
      <>
        {/* current weather main */}
        <h3>Current Weather</h3>
        <div
          style={{
            display: "inline-block",
            textAlign: "center",
            width: "200px",
            background: "#eee",
            borderRadius: "1em",
            padding: "1em",
          }}
        >
          <span className={Style.currentIcon}>
            <WeatherIcon
              weatherCode={this.props.weather.current.weather[0].id}
              size="1em"
              time={this.props.weather.current.dt}
              timezone={this.props.weather.timezone_offset}
            />
          </span>
          {/* <div>{this.props.weather.current.weather[0].main}</div> */}
          <div>
            <b>
              <WeatherTemp
                temp={this.props.weather.current.temp}
                decimals={1}
              />
            </b>
            <br />
            (
            <WeatherTemp
              temp={this.props.weather.current.feels_like}
              decimals={1}
            />
            )
          </div>
        </div>
        <h3>Next 48 Hours</h3>
        {/* hourly chart of temperature */}
        <div>
          <LineChart
            data={this.props.weather.hourly.map((hour) => {
              let h = UNIXtoDateTime(
                hour.dt,
                this.props.weather.timezone_offset,
              ).getUTCHours();
              return {
                x:
                  h === 0
                    ? "12AM"
                    : h === 12
                      ? "12PM"
                      : h > 12
                        ? h - 12 + "PM"
                        : h + "AM", //format time string
                y: parseFloat(processTemp(hour.temp, 1)), //get temp
              };
            })}
            append="C"
            major="3"
            height="350px"
          />
        </div>
        <span>Chance Of Rain</span>
        {/* hourly percipitation chart */}
        <div>
          <LineChart
            data={this.props.weather.hourly.map((hour) => {
              let h = UNIXtoDateTime(
                hour.dt,
                this.props.weather.timezone_offset,
              ).getUTCHours();
              return {
                x: h === 0 ? "12AM" : h > 12 ? h - 12 + "PM" : h + "AM", //format time string
                y: Math.floor(hour.pop * 100), //convert decimal to percentage
              };
            })}
            min="0"
            max="100"
            append="%" //add "%" to each value string
            major="3"
            height="150px"
          />
        </div>
        <h3>Next 7 Days</h3>
        <div>
          <LineChart
            data={this.props.weather.daily
              .map((day) => {
                return [
                  {
                    x: "Morn", //get day of week
                    y: parseFloat(processTemp(day.temp.morn, 1)), //get day temp
                  },
                  {
                    x: "Day", //get day of week
                    y: parseFloat(processTemp(day.temp.day, 1)), //get day temp
                  },
                  {
                    x: "Eve", //get day of week
                    y: parseFloat(processTemp(day.temp.eve, 1)), //get day temp
                  },
                  {
                    x: "Night", //get day of week
                    y: parseFloat(processTemp(day.temp.night, 1)), //get day temp
                  },
                ];
              })
              .flat()}
            min="-20"
            max="40"
            append="C"
            major="1"
            height="350px"
          />
        </div>
      </>
    );
  }
}
