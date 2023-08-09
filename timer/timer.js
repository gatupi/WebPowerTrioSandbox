const timers = [];
const svgns = "http://www.w3.org/2000/svg";

const digitSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 220">

    <!-- 
        Digito: 1, Leds: 3, 6
        Digito: 2, Leds: 1, 3, 4, 5, 7
        Digito: 3, Leds: 1, 3, 4, 6, 7
        Digito: 4, Leds: 2, 3, 4, 6
        Digito: 5, Leds: 1, 2, 4, 6, 7
        Digito: 6, Leds: 1, 2, 4, 5, 6, 7
        Digito: 7, Leds: 1, 3, 6
        Digito: 8, Leds: todos
        Digito: 9, Leds: 1, 2, 3, 4, 6, 7
     -->

    <rect width="100%" height="100%" />
    <g class="digit">
        <!-- 1 -->
        <polygon class="digit-led" points="30.07,17 37.14,24.07 107.14,24.07 114.21,17 107.14,9.93 37.14,9.93" fill="#222" />
        <!-- 2 -->
        <polygon class="digit-led" points="20,27.07 27.07,20 34.14,27.07 34.14,97.07 27.07,104.14 20,97.07" fill="#222" />
        <!-- 3 -->
        <polygon class="digit-led" points="110.14,27.07 117.21,20 124.21,27.07 124.21,97.07 117.21,104.14 110.14,97.07" fill="#222" />
        <!-- 4 -->
        <polygon class="digit-led" points="30.07,107.14 37.14,114.21 107.14,114.21 114.21,107.14 107.14,100.07 37.14,100.07"
            fill="#222" />
        <!-- 5 -->
        <polygon class="digit-led" points="20,117.21 27.07,110.14 34.14,117.21 34.14,187.21 27.07,194.28 20,187.21" fill="#222" />
        <!-- 6 -->
        <polygon class="digit-led" points="110.14,117.21 117.21,110.14 124.21,117.21 124.21,187.21 117.21,194.28 110.14,187.21"
            fill="#222" />
        <!-- 7 -->
        <polygon class="digit-led" points="30.07,197.28 37.14,204.35 107.14,204.35 114.21,197.28 107.14,190.21 37.14,190.21"
            fill="#222" />
    </g>
</svg>
`;

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
    stopBtn.textContent = this.#isStopped ? "Continue" : "Stop";
    resetBtn.textContent = "Reset";

    stopBtn.addEventListener("click", ({ target }) => {
      if (this.#isStopped) {
        this.start();
        target.textContent = "Stop";
      } else {
        this.stop();
        target.textContent = "Continue";
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

  const digitContainer = document.querySelector("#digitContainer");
  digitContainer.innerHTML = digitSvg;
  initCount();

  document.querySelector("#svgTimerContainer").append(drawTimer());
}

function initCount() {
  const digitContainer = document.querySelector("#digitContainer");
  let {
    dataset: { digit },
  } = digitContainer;
  updateDigitSvg();
  setInterval(() => {
    digit++;
    if (digit > 9) digit = 0;
    digitContainer.dataset.digit = digit;
    updateDigitSvg();
  }, 1000);
}

function updateDigitSvg() {
  const digitLeds = [
    [1, 2, 3, 5, 6, 7],
    [3, 6],
    [1, 3, 4, 5, 7],
    [1, 3, 4, 6, 7],
    [2, 3, 4, 6],
    [1, 2, 4, 6, 7],
    [1, 2, 4, 5, 6, 7],
    [1, 3, 6],
    [1, 2, 3, 4, 5, 6, 7],
    [1, 2, 3, 4, 6, 7],
  ];

  const digitContainer = document.querySelector("#digitContainer");
  const {
    dataset: { digit },
  } = digitContainer;
  // console.warn(digit);
  const leds = document.querySelectorAll(".digit-led");
  [...leds].forEach((led, index) => {
    const array = digitLeds[digit];
    led.setAttribute("fill", array.includes(index + 1) ? "crimson" : "#222");
  });
}

function setSvgAttributes(element, attributes) {
  Object.keys(attributes).forEach((key) => {
    const value = attributes[key];
    if (!!value) element.setAttribute(key, value);
  });
}

function createSegment(start_x = 60, start_y = 60, orientation = "vertical") {
  if (!["vertical", "horizontal"].includes(orientation?.toLowerCase())) {
    console.warn("invalid option for 'orientation'");
    return;
  }

  const segment = document.createElementNS(svgns, "polygon");
  segment.classList.add("display-segment");
  const [ray, size] = [15, 100];
  const sin = Math.sqrt(2) / 2;
  const cos = sin;

  const offsets = {
    vertical: [
      { x: 0, y: 0 },
      { x: ray * cos, y: -ray * sin },
      { x: ray * cos, y: ray * sin },
      { x: 0, y: size },
      { x: -ray * cos, y: ray * sin },
      { x: -ray * cos, y: -ray * sin },
    ],
    horizontal: [
      { x: 0, y: 0 },
      { x: -ray * sin, y: -ray * cos },
      { x: ray * sin, y: -ray * cos },
      { x: size, y: 0 },
      { x: ray * sin, y: ray * cos },
      { x: -ray * sin, y: ray * cos },
    ],
  };
  const offset = offsets[orientation];

  let points = "";
  offset.forEach((current, index) => {
    const previous = offset[index - 1] ?? { x: start_x, y: start_y };
    current.x += previous.x;
    current.y += previous.y;
    const { x, y } = current;

    points += `${x.toFixed(2)},${y.toFixed(2)} `;
  });

  setSvgAttributes(segment, { points, fill: "crimson" });

  return segment;
}

function create7SegmentDisplay({ x = 20, y = 60 } = {}) {
  console.log(x, y);
  const [start_x, start_y] = [x, y];

  const ray = 15;
  const size = 100;
  const radians = Math.PI / 4;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const gap = 4;

  const leds = [
    {
      orientation: "horizontal",
      x: 2 * ray * cos + gap,
      y: 0 - gap,
    },
    {
      orientation: "vertical",
      x: 0,
      y: 0,
    },
    {
      orientation: "vertical",
      x: 2 * ray * cos + size + 2 * gap,
      y: 0,
    },
    {
      orientation: "horizontal",
      x: 2 * ray * cos + gap,
      y: 2 * ray * sin + size + gap,
    },
    {
      orientation: "vertical",
      x: 0,
      y: 2 * ray * sin + size + 2 * gap,
    },
    {
      orientation: "vertical",
      x: 2 * ray * cos + size + 2 * gap,
      y: 2 * ray * sin + size + 2 * gap,
    },
    {
      orientation: "horizontal",
      x: 2 * ray * cos + gap,
      y: 2 * (2 * ray * sin + size) + 3 * gap,
    },
  ];

  const display = document.createElementNS(svgns, "g");
  display.classList.add("seven-segment-display");
  leds.forEach(({ orientation, x, y }) => {
    display.append(createSegment(start_x + x, start_y + y, orientation));
  });

  return display;
}

function drawTimer() {
  const [width, height] = [1200, 400];

  const svg = document.createElementNS(svgns, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const rect = document.createElementNS(svgns, "rect");
  setSvgAttributes(rect, { width, height, fill: "#000" });

  svg.append(
    rect,
    create7SegmentDisplay(),
    create7SegmentDisplay({ x: 200 }),
    create7SegmentDisplay({ x: 400 }),
    create7SegmentDisplay({ x: 600 }),
    create7SegmentDisplay({ x: 800 }),
  );

  return svg;
}
