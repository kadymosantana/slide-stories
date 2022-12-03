import Timeout from "./Timeout.js";

export default class Slide {
  container;
  slides;
  controls;
  time;
  index: number; // index that is currently active
  slide: Element; // slide that is currently active
  timeout: Timeout | null;
  paused: boolean;
  pausedTimeout: Timeout | null;

  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    time: number = 5000
  ) {
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;

    this.timeout = null;
    this.index = 0;
    this.slide = this.slides[this.index];

    this.paused = false;
    this.pausedTimeout = null;

    this.init();
  }

  show(index: number) {
    this.index = index;
    this.slide = this.slides[index];
    this.slides.forEach((el) => this.hide(el));
    this.slide.classList.add("active");
    this.auto(this.time);
  }

  hide(el: Element) {
    el.classList.remove("active");
  }

  auto(time: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), time);
  }

  prev() {
    if (this.paused) return;
    if (this.index > 0) this.show(this.index - 1);
  }

  next() {
    if (this.paused) return;
    this.index < this.slides.length - 1
      ? this.show(this.index + 1)
      : this.show(0);
  }

  pause() {
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true;
    }, 1000);
  }

  continue() {
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
    }
  }

  private addControls() {
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");

    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);

    this.controls.addEventListener("pointerdown", () => this.pause());
    this.controls.addEventListener("pointerup", () => this.continue());

    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  private init() {
    this.addControls();
    this.show(this.index);
  }
}
