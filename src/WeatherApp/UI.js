import React from "react";
import LocationList from "./LocationList";
import ForecastContainer from "./ForecastContainer";

export default class UI extends React.Component {
  render() {
    return (
      <div>
        <LocationList
          storedLocations={this.props.storedLocations}
          handleLocationChange={this.props.handleLocationChange}
          locationModalRef={this.props.locationModalRef}
        />
        {this.props.weather ? ( //don't render until weather data has been loaded
          <ForecastContainer
            location={this.props.location}
            weather={this.props.weather}
            style={this.props.style}
            handleRemoveLocation={this.props.handleRemoveLocation}
          />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
