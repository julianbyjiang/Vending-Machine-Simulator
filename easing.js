// Adapted from https://github.com/ai/easings.net
// See in particular https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
// (which wasn't written in JS but was easily adapted into this code).

// Do something a bit advanced to create a dictionary of useful constants.
// Ignore this.
const easingConstants = (function () {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  const c3 = c1 + 1;
  const c4 = (2 * Math.PI) / 3;
  const c5 = (2 * Math.PI) / 4.5;

  return { c1: c1, c2: c2, c3: c3, c4: c4, c5: c5 };
})();

// Definitions of all the easing functions

function easeInQuad(x) {
  return x * x;
};

function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
};

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
};

function easeInCubic(x) {
  return x * x * x;
};

function easeOutCubic(x) {
  return 1 - pow(1 - x, 3);
};

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
};

function easeInQuart(x) {
  return x * x * x * x;
};

function easeOutQuart(x) {
  return 1 - pow(1 - x, 4);
};

function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
};

function easeInQuint(x) {
  return x * x * x * x * x;
};

function easeOutQuint(x) {
  return 1 - pow(1 - x, 5);
};

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
};

function easeInSine(x) {
  return 1 - cos((x * PI) / 2);
};

function easeOutSine(x) {
  return sin((x * PI) / 2);
};

function easeInOutSine(x) {
  return -(cos(PI * x) - 1) / 2;
};

function easeInExpo(x) {
  return x === 0 ? 0 : pow(2, 10 * x - 10);
};

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x);
};

function easeInOutExpo(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2;
};

function easeInCirc(x) {
  return 1 - sqrt(1 - pow(x, 2));
};

function easeOutCirc(x) {
  return sqrt(1 - pow(x - 1, 2));
};

function easeInOutCirc(x) {
  return x < 0.5
    ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
    : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
};

function easeInBack(x) {
  return easingConstants.c3 * x * x * x - easingConstants.c1 * x * x;
};

function easeOutBack(x) {
  return (
    1 + easingConstants.c3 * pow(x - 1, 3) + easingConstants.c1 * pow(x - 1, 2)
  );
};

function easeInOutBack(x) {
  return x < 0.5
    ? (pow(2 * x, 2) *
        ((easingConstants.c2 + 1) * 2 * x - easingConstants.c2)) /
        2
    : (pow(2 * x - 2, 2) *
        ((easingConstants.c2 + 1) * (x * 2 - 2) + easingConstants.c2) +
        2) /
        2;
};

function easeInElastic(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * easingConstants.c4);
};

function easeOutElastic(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : pow(2, -10 * x) * sin((x * 10 - 0.75) * easingConstants.c4) + 1;
};

function easeInOutElastic(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * easingConstants.c5)) / 2
    : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * easingConstants.c5)) / 2 +
      1;
};

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};

function easeInBounce(x) {
  return 1 - easeOutBounce(1 - x);
};

function easeInOutBounce(x) {
  return x < 0.5
    ? (1 - easeOutBounce(1 - 2 * x)) / 2
    : (1 + easeOutBounce(2 * x - 1)) / 2;
};

