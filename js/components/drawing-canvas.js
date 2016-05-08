import * as React from "react";
import * as ReactDOM from "react-dom";

import TransportEvent from "../transport-event";
import TransportEventImage from "./transport-event-image";

export default class DrawingCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transportEvents: {},
      offsets: undefined,
      downPosition: undefined,
      dragPosition: undefined
    }

    this.selectedTransportEvent = undefined;
  }

  componentDidMount() {
    this.updateOffsets();
  }

  scheduleTransportEvent(transportEvent) {
    transportEvent.schedule();
    let transportEvents = this.state.transportEvents;
    transportEvents[transportEvent.id] = transportEvent;
    this.setState({ transportEvents: transportEvents });
  }

  unscheduleTransportEvent(id) {
    let transportEvents = this.state.transportEvents,
        transportEvent = transportEvents[id];
    delete transportEvents[id];
    this.setState({ transportEvents: transportEvents });
    transportEvent.unschedule();
  }

  updateOffsets() {
    let thisNode = ReactDOM.findDOMNode(this);
    this.setState({
      offsets: thisNode.getBoundingClientRect()
    });
  }

  canvasPosition(position) {
    return {
      x: position.x - this.state.offsets.left,
      y: position.y - this.state.offsets.top
    };
  }

  relativePosition(position) {
    return {
      x: position.x / this.state.offsets.width,
      y: position.y / this.state.offsets.height
    };
  }

  handleMouseUp(event) {
    // only left click
    if (event.button === 0) {
      this.scheduleTransportEvent(this.selectedTransportEvent);

      this.unsetselectedTransportEvent();
      this.setState({
        downPosition: undefined,
        dragPosition: undefined
      });
    }
  }

  unsetselectedTransportEvent() {
    this.selectedTransportEvent.stop();
    this.selectedTransportEvent = undefined;
  }

  withRelativePosition(pos, fn) {
    fn(this.relativePosition(this.canvasPosition(pos)));
  }

  selectTransportEvent(transportEvent) {
    transportEvent.audition();
    this.selectedTransportEvent = transportEvent;
  }

  handleMouseDown(event) {
    // only left click
    if (event.button === 0) {
      this.withRelativePosition({ x: event.pageX, y: event.pageY }, (pos) => {
        this.selectTransportEvent(new TransportEvent(this.props.voice, pos));

        this.setState({
          downPosition: pos,
          dragPosition: pos
        });
      });
    }
  }

  handleMouseMove(event) {
    if (this.selectedTransportEvent) {
      this.withRelativePosition({ x: event.pageX, y: event.pageY }, (pos) => {
        this.selectedTransportEvent.update(pos);
        this.setState({
          dragPosition: pos
        });
      });
    }
  }

  handleEventImageMouseDown(id, event) {
    if (event.button === 0) {
      event.stopPropagation();
      this.selectTransportEvent(this.state.transportEvents[id]);
      this.unscheduleTransportEvent(id);
    }
  }

  transportEventImage(transportEvent) {
    return (
      <TransportEventImage
        key={transportEvent.id || "pending"}
        data={transportEvent}
        onMouseDown={this.handleEventImageMouseDown.bind(this)}
      />
    );
  }

  transportEventImages() {
    return Object.keys(this.state.transportEvents).map((id) => {
      return this.transportEventImage(this.state.transportEvents[id]);
    });
  }

  selectedTransportEventImage() {
    if (this.selectedTransportEvent) {
      return this.transportEventImage(this.selectedTransportEvent)
    } else {
      return "";
    }
  }

  render() {
    return (
      <div
        className="drawing-canvas"
        onMouseDown={this.handleMouseDown.bind(this)}
        onMouseUp={this.handleMouseUp.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}
      >
        {this.selectedTransportEventImage()}
        {this.transportEventImages()}
      </div>
    );
  }
}
