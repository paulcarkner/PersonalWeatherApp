import Style from "./LocationListItem.module.css";
import React from "react";
import WeatherPreview from "./WeatherPreview";

export default class LocationListItem extends React.Component {
  changeLocation = (e) => {
    this.props.handleLocationChange(this.props.location); //lift location change up to app
    return false;
  };

  render() {
    return (
      <button className={Style.locationListItem} onClick={this.changeLocation}>
        <div className={Style.city}>{this.props.location.name}</div>
        <div className={Style.forecast}>
          <WeatherPreview location={this.props.location} weather={null} />
        </div>
        <div className={Style.region}>
          {this.props.location.state ? this.props.location.state + ", " : ""}{/* if state exists prepend to country */}
          {this.props.location.country}
        </div>
      </button>
    );
  }
}
