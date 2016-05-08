import Tone from "tone";

import * as Util from "./util";

const MIN_FREQUENCY = 10;
const MAX_FREQUENCY = 1200;
const FREQUENCY_DEPTH = MAX_FREQUENCY - MIN_FREQUENCY;

export default class TransportEvent {
  constructor(voice, position) {
    this.voice = voice;
    this.timePosition = position.x;
    this.pitchPosition = position.y;
    this.duration = "0:0:0.5";
    this.velocity = 1;
  }

  scheduleFn(time) {
    this.voice.triggerAttackRelease(this.pitch(), this.duration, time, this.velocity);
  }

  audition(time) {
    this.voice.triggerAttack(this.pitch());
  }

  schedule() {
    this.id = Tone.Transport.schedule(this.scheduleFn.bind(this), this.transportTime());
  }

  unschedule() {
    Tone.Transport.clear(this.id);
    this.id = undefined;
  }

  stop() {
    this.voice.triggerRelease();
  }

  update(position) {
    this.timePosition = position.x;
    this.pitchPosition = position.y;
    this.voice.setNote(this.pitch());
  }

  pitch() {
    return ((1 - this.pitchPosition) * FREQUENCY_DEPTH) + MIN_FREQUENCY;
  }

  transportTime() {
    let barsFloat = this.timePosition * Util.transportBars(),
        bars = Math.floor(barsFloat),
        quartersFloat = (barsFloat - bars) * Util.quartersPerBar(),
        quarters = Math.floor(quartersFloat),
        sixteenthsFloat = (quartersFloat - quarters) * Util.SIXTEENTHS_PER_QUARTER;

    // return "0:3:0.123";
    return Util.transportTime({
      bars: bars,
      quarters: quarters,
      sixteenths: sixteenthsFloat
    });
  }
}
