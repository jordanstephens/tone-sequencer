import * as React from "react";

import * as Util from "../util";

export default class TransportEventImage extends React.Component {
  render() {
    let data = this.props.data,
        x = Util.percentageFromRatio(data.timePosition),
        y = Util.percentageFromRatio(data.pitchPosition),
        durationLength = Util.percentageFromRatio(Util.positionFromTransportTime(data.duration)),
        radius = 2 + (12 * data.velocity),
        halfRadius = radius / 2,
        fill = "green",
        svgStyle = {
          position: "absolute",
          left: x,
          top: y,
          height: radius,
          width: durationLength,
          transform: "translate(-" + halfRadius + "px, -" + halfRadius + "px)"
        };


    return (
      <svg style={svgStyle}>
        <rect
          onMouseDown={this.props.onMouseDown.bind(null, data.id)}
          fill={fill}
          x={0}
          y={0}
          rx={radius / 2}
          height="100%"
          width="100%"
        ></rect>
      </svg>
    );
  }
}
