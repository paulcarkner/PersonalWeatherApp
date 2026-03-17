import Style from "./LocationModal.module.css";
import React from "react";
import Search from "./Search";

//modal to add new location
export default class LocationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isShown: false };
  }

  changeHandler = (data) => {
    this.setState({ isShown: false }); //once new location selected, hide modal
    this.props.changeHandler(data); //lift new location to app to load weather
  };

  render() {
    if (!this.state.isShown) return; //don't render if not called yet
    return (
      <div className={Style.full}>
        <Search changeHandler={this.changeHandler} />
      </div>
    );
  }
}
