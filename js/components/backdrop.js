import * as React from "react";
import Tone from "tone";

class Backdrop extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0
    };
  }

  componentDidMount() {
    Tone.Transport.scheduleRepeat((time) => {
      this.setState({
        progress: Tone.Transport.progress
      });
    }, "4i");
  }
  progressBarPosition() {
    // return (this.state.progress * 100).toString() + "%";
    return (Tone.Transport.progress * 100).toString() + "%";
  }

  bpm() {
    return Tone.Transport.bpm.value;
  }

  position() {
    return Tone.Transport.position.split(":").map((str) => {
      return parseInt(str, 10);
    }).join(":");
  }

  render() {
    return (
      <div className="backdrop">
        <svg>
          <line
            className="progress-bar"
            x1={this.progressBarPosition()}
            y1="0"
            x2={this.progressBarPosition()}
            y2="100%"
          ></line>
          <line className="measure-line" x1="25%" y1="0" x2="25%" y2="100%" ></line>
          <line className="measure-line" x1="50%" y1="0" x2="50%" y2="100%" ></line>
          <line className="measure-line" x1="75%" y1="0" x2="75%" y2="100%" ></line>
        </svg>
        <div className="transport-bar">
          {this.position()}
        </div>
      </div>
    );
  }
}

export default Backdrop;
