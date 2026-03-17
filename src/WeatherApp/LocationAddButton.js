import Style from "./LocationAddButton.module.css";
import React from "react";

//button that shows the "add location" modal when clicked
export default class LocationAddButton extends React.Component {
  showLocationAddModal = (event) => {
    this.props.locationModalRef.current.setState({ isShown: true });
  };

  render() {
    return (
      <button className={Style.addButton} onClick={this.showLocationAddModal}>
        <span className="material-icons-outlined">add_circle_outline</span>
        <span>Add Location</span>
      </button>
    );
  }
}
