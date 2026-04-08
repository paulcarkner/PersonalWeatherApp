import Style from "./App.module.css";
import React from "react";
import { fetchForecast } from "./Utils/Weather.js";
import UI from "./UI";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: 44.300812,
        lon: -79.607438,
        name: "Innisfil",
        state: "Ontario",
        country: "CA",
      },
      weather: null,
    };
  }

  componentDidMount() {
    fetchForecast(this.state.location, "minutely,alerts").then((forecast) => {
      console.log(JSON.stringify(forecast));
      this.setState({
        location: this.state.location,
        weather: forecast,
      });
    });
  }

  render() {
    document.title = "Weather App";

    return (
      <div>
        <UI location={this.state.location} weather={this.state.weather} />
      </div>
    );
  }
}
