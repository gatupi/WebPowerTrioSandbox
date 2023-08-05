var timers = [];

class Timer {
  #initialDateTime;
  #now;
  #currentDateTime;
  #element;
  #interval;
  #isStopped;
  static #pattern = /\d\d(:\d\d){2}/;

  constructor(element, { initialTime, autoplay = false }) {
    if (!(element instanceof HTMLElement))
      throw "'element' must be an html element!";

    this.#initialDateTime = this.#now = new Date();
    this.#element = element;
    this.setTime(initialTime);
    this.#currentDateTime = this.#initialDateTime;

    this.#isStopped = true;

    if (autoplay) {
        this.start();
        this.#isStopped = false;
      }

    this.#buildHTML();
    this.#updateHTML();
  }

  start() {
    this.#isStopped = false;
    this.#interval = setInterval(() => {
      const timeDiff = new Date().getTime() - this.#now.getTime();
      this.#currentDateTime = new Date(
        this.#initialDateTime.getTime() + timeDiff
      );
      this.#updateHTML();
    }, 1000);
  }

  stop() {
    this.#isStopped = true;
    clearInterval(this.#interval);
  }

  reset() {}

  setTime(timeString) {

    if (!timeString) {
        this.#initialDateTime = this.#now;
        return;
    }

    if (typeof timeString != "string") {
      console.warn("'timeString' must be a string!");
      return;
    }

    const [value] = timeString.match(Timer.#pattern) ?? ["00:00:00"];
    const dt = this.#now;
    const [year, month, day] = [
      dt.getFullYear(),
      dt.getMonth() + 1,
      dt.getDate(),
    ];
    const dateString = `${leftZero(year, 4)}-${leftZero(month)}-${leftZero(
      day
    )}`;

    this.#initialDateTime = new Date(`${dateString}T${value}`);
    console.log(this.#initialDateTime);
  }

  #updateHTML() {
    const dt = this.#currentDateTime;
    const [hours, minutes, seconds] = [
      dt.getHours(),
      dt.getMinutes(),
      dt.getSeconds(),
    ];

    this.#element.querySelector(".display").textContent = `${formatTime({
      hours,
      minutes,
      seconds,
    })}`;
  }

  #buildHTML() {
    const [setTimeBtn, stopBtn, resetBtn] = new Array(3)
      .fill(0)
      .map(() => document.createElement("button"));

    const display = document.createElement("span");
    display.classList.add("display");

    setTimeBtn.textContent = "Set time";
    stopBtn.textContent = this.#isStopped ? 'Continue' : 'Stop';
    resetBtn.textContent = "Reset";

    stopBtn.addEventListener("click", ({ target }) => {
      if (this.#isStopped) {
        this.start();
        target.textContent = 'Stop';
      } else {
        this.stop();
        target.textContent = 'Continue';
      }
    });

    this.#element.append(display, setTimeBtn, stopBtn, resetBtn);
  }
}

const leftZero = (number, q = 2) => number.toString().padStart(q, "0");

const formatTime = ({ hours, minutes, seconds }) =>
  `${leftZero(hours)}:${leftZero(minutes)}:${leftZero(seconds)}`;

function runTimerScript() {
  var timers = document.querySelectorAll(".timer");

  timers.forEach((element) => {
    const {
      dataset: { initialTime, autoplay },
    } = element;

    const timer = new Timer(element, {
      initialTime,
      autoplay: `${autoplay}`.toLowerCase() === "true",
    });
  });

  console.log("Hello World! :)");
}
