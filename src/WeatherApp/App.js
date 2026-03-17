import Style from "./App.module.css";
import React from "react";
import { fetchForecast, getWeatherStyle } from "./Utils/Weather.js";
import AppBackground from "./AppBackground";
import LocationModal from "./LocationModal";
import UI from "./UI";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      weather: null,
      storedLocations: JSON.parse(
        localStorage.getItem("WeatherApp_StoredLocations")
      ),
      style: getWeatherStyle(1, 0, 2, 0),
    };
    if (
      this.state.storedLocations === null ||
      this.state.storedLocations.length === 0
    )
      //if there are no stored locations add default locations
      this.state.storedLocations = [
        {
          lat: -34.9281805,
          lon: 138.5999312,
          name: "Adelaide",
          state: "South Australia",
          country: "AU",
        },
        {
          lat: 39.906217,
          lon: 116.3912757,
          name: "Beijing",
          state: "Beijing",
          country: "CN",
        },
        {
          lat: -6.8160837,
          lon: 39.2803583,
          name: "Dar es Salaam",
          country: "TZ",
        },
        {
          lat: 51.5073219,
          lon: -0.1276474,
          name: "London",
          state: "England",
          country: "GB",
        },
        {
          lat: 28.6138954,
          lon: 77.2090057,
          name: "New Delhi",
          state: "Delhi",
          country: "IN",
        },
        {
          lat: 43.6534817,
          lon: -79.3839347,
          name: "Toronto",
          state: "Ontario",
          country: "CA",
        },
        {
          lat: 49.2608724,
          lon: -123.113952,
          name: "Vancouver",
          state: "British Columbia",
          country: "CA",
        },
      ];
    this.state.location = this.state.storedLocations[0]; //load first location
    this.locationModal = React.createRef();
  }

  handleLocationChange = (data) => {
    let locationParams = {
      lat: data.lat,
      lon: data.lon,
      name: data.name,
      state: data.state,
      country: data.country,
    };

    //if location is not in stored list, add
    if (
      !this.state.storedLocations.some(
        (loc) =>
          loc.lat === locationParams.lat && loc.lon === locationParams.lon
      )
    ) {
      this.setState(
        { storedLocations: [...this.state.storedLocations, locationParams] },
        () => {
          this.saveStoredLocations();
        }
      );
    }

    fetchForecast(data.lat, data.lon, "minutely,alerts").then((forecast) =>
      this.setState({
        location: data,
        weather: forecast,
        style: getWeatherStyle(
          forecast.current.dt * 1000, //add 3 zeros to time to make UNIX time
          forecast.current.sunrise * 1000, //add 3 zeros to time to make UNIX time
          forecast.current.sunset * 1000, //add 3 zeros to time to make UNIX time
          forecast.current.clouds
        ),
      })
    );
  };

  handleRemoveLocation = () => {
    if (this.state.storedLocations.length === 1) {
      //must have at least one stored location
      alert("You cannot remove the last location from your stored locations.");
      return;
    }

    if (
      //abort if not confirmed
      !window.confirm(
        "Are you sure you want to remove this location from your stored locations?"
      )
    )
      return;

    //remove location from stored list
    let filteredLocations = this.state.storedLocations.filter(
      (loc) =>
        loc.lat !== this.state.location.lat ||
        loc.lon !== this.state.location.lon
    ); //get all locations that aren't the one being removed

    this.setState({ storedLocations: filteredLocations }, () => {
      this.saveStoredLocations(); //save to localStorage
      this.handleLocationChange(this.state.storedLocations[0]); //load first location
    });
  };

  //save locations to localStorage
  saveStoredLocations = () => {
    localStorage.setItem(
      "WeatherApp_StoredLocations",
      JSON.stringify(this.state.storedLocations)
    );
  };

  componentDidMount() {
    this.handleLocationChange(this.state.storedLocations[0]); //load first location
  }

  render() {
    document.title = "Weather Map App";

    return (
      <div
        className={Style.app}
        style={{
          backgroundImage: `linear-gradient(180deg, hsl(${this.state.style.gradient.start.hue}deg ${this.state.style.gradient.start.sat}% ${this.state.style.gradient.start.lum}%), hsl(${this.state.style.gradient.end.hue}deg ${this.state.style.gradient.end.sat}% ${this.state.style.gradient.end.lum}%))`,
        }}
      >
        <AppBackground
          location={this.state.location}
          weather={this.state.weather}
          style={this.state.style}
        />
        <UI
          location={this.state.location}
          weather={this.state.weather}
          storedLocations={this.state.storedLocations}
          handleLocationChange={this.handleLocationChange}
          style={this.state.style}
          locationModalRef={this.locationModal}
          handleRemoveLocation={this.handleRemoveLocation}
        />
        <LocationModal
          ref={this.locationModal}
          changeHandler={this.handleLocationChange}
        />

        <script src="https://unpkg.com/@googlemaps/js-api-loader@1.0.0/dist/index.min.js"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </div>
    );
  }
}
