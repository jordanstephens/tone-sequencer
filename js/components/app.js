import * as React from "react";
import Tone from "tone";

import Backdrop from "./backdrop";
import DrawingCanvas from "./drawing-canvas";

import * as Util from "../util";

let voice = new Tone.MonoSynth().toMaster();

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      bars: 1
    };
  }

  componentDidMount() {
    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = Util.transportTime({
      bars: this.state.bars
    });
    Tone.Transport.start();
  }

  render() {
    return (
      <div className="app">
        <Backdrop />
        <DrawingCanvas
          voice={voice}
        />
      </div>
    );
  }
}
