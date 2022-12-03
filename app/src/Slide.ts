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
  thumbItems: HTMLElement[] | null;
  thumb: HTMLElement | null;

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

    this.thumbItems = null;
    this.thumb = null;

    this.init();
  }

  show(index: number) {
    this.index = index;
    this.slide = this.slides[index];

    if (this.thumbItems && this.thumbItems.length) {
      this.thumb = this.thumbItems[this.index];
      this.thumbItems.forEach((el) => el.classList.remove("active"));
      this.thumb.classList.add("active");
    }

    localStorage.setItem("activeSlide", String(this.index));

    this.slides.forEach((el) => this.hide(el));
    this.slide.classList.add("active");

    this.slide instanceof HTMLVideoElement
      ? this.autoVideo(this.slide)
      : this.auto(this.time);
  }

  autoVideo(video: HTMLVideoElement) {
    let firstPlay = true;

    video.addEventListener("playing", () => {
      this.auto(video.duration * 1000);
      firstPlay = false;
    });

    video.muted = true;
    video.play();
  }

  hide(el: Element) {
    el.classList.remove("active");

    if (el instanceof HTMLVideoElement) {
      el.currentTime = 0;
    }
  }

  auto(time: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), time);

    if (this.thumb) this.thumb.style.animationDuration = `${time}ms`;
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
      this.thumb?.classList.add("paused");

      if (this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 1000);
  }

  continue() {
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      this.thumb?.classList.remove("paused");

      if (this.slide instanceof HTMLVideoElement) {
        this.slide.play();
      }
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

  private addThumbItems() {
    const thumbContainer = document.createElement("div");
    thumbContainer.id = "slide-thumb";

    for (let i = 0; i < this.slides.length; i++) {
      thumbContainer.innerHTML += `
      <span> <span class="thumb-item"></span> </span>`;
    }

    this.controls.appendChild(thumbContainer);
    this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"));
  }

  private init() {
    this.addControls();
    this.addThumbItems();

    localStorage.activeSlide
      ? this.show(+localStorage.activeSlide)
      : this.show(this.index);
  }
}
