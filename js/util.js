import Tone from "tone";

export const SECONDS_PER_MINUTE = 60;
export const SIXTEENTHS_PER_QUARTER = 4;

export function transportBars() {
  let beatsPerSecond = Tone.Transport.bpm.value / SECONDS_PER_MINUTE,
      beatsPerLoop = Tone.Transport.loopEnd * beatsPerSecond;
  return beatsPerLoop / Tone.Transport.timeSignature;
}

export function quartersPerBar() {
  return Tone.Transport.timeSignature;
}

export function transportQuarters() {
  return quartersPerBar() * transportBars();
}

export function transportSixteenths() {
  return SIXTEENTHS_PER_QUARTER * transportQuarters();
}

export function transportTime(opts) {
  return [
    (opts.bars || 0),
    (opts.quarters || 0),
    (opts.sixteenths || 0)
  ].join(":");
}

export function percentageFromRatio(ratio) {
  return (ratio * 100).toString() + "%";
}

// down and drag are x, y coords
export function dragDistance(down, drag) {
  return {
    x: drag.x - down.x,
    y: drag.y - down.y
  };
}

export function positionFromTransportTime(transportTime) {
  const bars = transportBars(),
        quarters = transportQuarters(),
        sixteenths = transportSixteenths();

  return transportTime.split(":").reduce((memo, timeComponent, index) => {
    if (index === 0) {
      return memo + (timeComponent / bars);
    } else if (index === 1) {
      return memo + (timeComponent / quarters);
    } else if (index === 2) {
      return memo + (timeComponent / sixteenths);
    } else {
      return memo;
    }
  }, 0);
}
