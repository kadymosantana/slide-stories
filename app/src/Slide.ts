export default class Slide {
  container;
  slides;
  controls;
  time;
  index: number; // index that is currently active
  slide: Element; // slide that is currently active

  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    time: number = 5000) {
      this.container = container;
      this.slides = slides;
      this.controls = controls;
      this.time = time;

      this.index = 0;
      this.slide = this.slides[this.index]
    }

  show(index: number) {
    this.index = index;
    this.slide = this.slides[index];
    this.slides.forEach(el => this.hide(el));
    this.slide.classList.add("active");
  }

  hide(el: Element) {
     el.classList.remove("active");
  }

  prev() {
    if(this.index > 0) this.show(this.index - 1)
  }

  next() {
    this.index < this.slides.length - 1 ?
    this.show(this.index + 1) :
    this.show(0)
  }

  private addControls() {
    const prevButton = document.createElement("button")
    const nextButton = document.createElement("button")

    this.controls.appendChild(prevButton)
    this.controls.appendChild(nextButton)

    prevButton.addEventListener("pointerup", () => this.prev())
    nextButton.addEventListener("pointerup", () => this.next())
  }

  private init() {
    this.addControls()
    this.show(this.index)
  }
}
