import React from "react";
import Forecast from "./Forecast";

export default class UI extends React.Component {
  render() {
    setTimeout(
      () => {
        window.location.reload();
      },
      1000 * 60 * 60,
    );
    return (
      <div>
        {this.props.weather ? ( //don't render until weather data has been loaded
          <Forecast
            location={this.props.location}
            weather={this.props.weather}
          />
        ) : (
          <div>Loading...</div>
        )}
        <footer
          style={{
            marginTop: "3em",
            fontSize: "0.8em",
            color: "#aaab",
          }}
        >
          Page loaded: {new Date().toLocaleTimeString()}
        </footer>
      </div>
    );
  }
}
