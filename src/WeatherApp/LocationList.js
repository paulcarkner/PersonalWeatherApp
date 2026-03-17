import Style from "./LocationList.module.css";
import React from "react";
import LocationListItem from "./LocationListItem";
import LocationAddButton from "./LocationAddButton";

//bottom menu list of locations
export default class LocationList extends React.Component {
  render() {
    return (
      <div className={Style.locationList}>
        {this.props.storedLocations
          .sort((a, b) => (a.name > b.name ? 1 : -1)) //sort list alphabetically
          .map((loc, key) => ( //create location button for each location with weather preview
            <LocationListItem
              location={loc}
              key={key}
              handleLocationChange={this.props.handleLocationChange}
            />
          ))}
        <LocationAddButton locationModalRef={this.props.locationModalRef} /> {/* add location button */}
      </div>
    );
  }
}
