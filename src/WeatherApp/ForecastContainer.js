import Style from "./ForecastContainer.module.css";
import React from "react";
import WeatherIcon from "./WeatherIcon";
import WeatherTemp from "./WeatherTemp";
import ForecastDays from "./ForecastDays";
import LineChart from "./LineChart";
import ForecastDetail from "./ForecastDetail";
import { processTemp, UNIXtoDateTime, getUTCTime } from "./Utils/Weather.js";

//wrapper for forecast component to position on page
export default class ForecastContainer extends React.Component {
  render() {
    return (
      <div className={Style.forecastContainer}>
        <Forecast
          location={this.props.location}
          weather={this.props.weather}
          style={this.props.style}
          handleRemoveLocation={this.props.handleRemoveLocation}
        />
      </div>
    );
  }
}

class Forecast extends React.Component {
  render() {
    return (
      <div
        className={Style.forecastPanel}
        style={{
          backgroundImage: `linear-gradient(180deg, hsl(${this.props.style.gradient.start.hue}deg ${this.props.style.gradient.start.sat}% ${this.props.style.gradient.start.lum}%), hsl(${this.props.style.gradient.end.hue}deg ${this.props.style.gradient.end.sat}% ${this.props.style.gradient.end.lum}%))`,
        }}
      >
        <div className={Style.leftPanel}>
          <div>
            {/* button to remove location from stored locations */}
            <button
              className={Style.removeBtn}
              onClick={this.props.handleRemoveLocation}
            >
              <span className="material-icons-outlined">push_pin</span>
            </button>
            <div className={Style.locationName}>{this.props.location.name}</div>
          </div>
          {/* current weather main */}
          <div className={Style.currentMain}>
            <WeatherIcon
              className={Style.currentIcon}
              weatherCode={this.props.weather.current.weather[0].id}
              size="1em"
              time={this.props.weather.current.dt}
              timezone={this.props.weather.timezone_offset}
            />
            <div>{this.props.weather.current.weather[0].main}</div>
            <div className={Style.currentMainTemp}>
              <WeatherTemp
                temp={this.props.weather.current.temp}
                decimals={1}
              />
            </div>
          </div>
          <div>
            {/* hourly chart of temperature */}
            <LineChart
              data={this.props.weather.hourly.slice(1, 8).map((hour) => { //get next 8 hours
                let h = UNIXtoDateTime(
                  hour.dt,
                  this.props.weather.timezone_offset
                ).getUTCHours();
                return {
                  x: h === 0 ? "12AM" : h > 12 ? h - 12 + "PM" : h + "AM", //format time string
                  y: parseFloat(processTemp(hour.temp, 1)), //get temp
                };
              })}
              append="C"
              major="1"
            />
          </div>
        </div>
        <div className={Style.divider}></div>{/* vertical dividing line */}
        <div className={Style.rightPanel}>
          <div className={Style.sectionTitle}>
            <span>Details</span>
          </div>
          <div className={Style.detailsContainer}>
            {/* current weather parameters */}
            <ForecastDetail icon="diw-thermometer-50" title="Feels Like">{/* feels like temperature */}
              <WeatherTemp
                temp={this.props.weather.current.feels_like}
                decimals={1}
              />
            </ForecastDetail>
            <ForecastDetail icon="diw-wind" title="Wind">{/* wind speen */}
              <div>
                {(this.props.weather.current.wind_speed * 3.6).toFixed(1)} km/h{" "}
                <span
                  className="material-icons-outlined"
                  style={{
                    transform: `rotate(${
                      360 - this.props.weather.current.wind_deg
                    }deg)`,
                    fontSize: "1em",
                    display: "inline-block",
                  }}
                >
                  arrow_upward
                </span> {/* rotate arrow to show wind direction */}
              </div>
            </ForecastDetail>
            <ForecastDetail
              icon="material-icons-outlined"
              iconInner="water_drop"
              title="Humidity"
            >{/* humidity */}
              <div>{this.props.weather.current.humidity} %</div>
            </ForecastDetail>
            <ForecastDetail
              icon="material-icons-outlined"
              iconInner="speed"
              title="Pressure"
            >{/* atmospheric pressure */}
              <div>{this.props.weather.current.pressure / 10} kPa</div>
            </ForecastDetail>
            <ForecastDetail icon="diw-sun-rise" title="Sunrise">{/* today's sunrise time */}
              <div>
                {getUTCTime(
                  UNIXtoDateTime(
                    this.props.weather.current.sunrise,
                    this.props.weather.timezone_offset
                  )
                )}
              </div>
            </ForecastDetail>
            <ForecastDetail icon="diw-sun-set" title="Sunset">{/* today's sunset time */}
              <div>
                {getUTCTime(
                  UNIXtoDateTime(
                    this.props.weather.current.sunset,
                    this.props.weather.timezone_offset
                  )
                )}
              </div>
            </ForecastDetail>
          </div>
          <div className={Style.sectionTitle}>
            <span>Chance Of Rain</span>
          </div>
          <div>
            {/* hourly percipitation chart */}
            <LineChart
              data={this.props.weather.hourly.slice(1, 26).map((hour) => { //get next 26 hours
                let h = UNIXtoDateTime(
                  hour.dt,
                  this.props.weather.timezone_offset
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
            />
          </div>
          <div className={Style.sectionTitle}>
            <span>Next 7 Days</span>
          </div>
          <div>
            <ForecastDays
              weather={this.props.weather}
              location={this.props.location}
            />
          </div>
        </div>
      </div>
    );
  }
}
