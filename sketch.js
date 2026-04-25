// README
/*
Vending Machine Simulator
Julia Huynh
Julian Bi Ying Jiang

INSTRUCTIONS
<explain what your program does and how to use it>
You, the player, are an alien trying to learn how to blend in as a human. One of the required skills you need to master before you are allowed to land on Earth is knowing how to use a vending machine. This is vending machine simulator that lets you practice this skill.  

FEATURES
<List the JavaScript and P5.js features you used in the Final Project, 
from the list in the project specification, with a brief description 
of how/where each is used>

CODE QUALITY AND VISUAL DESIGN
<argue for your code quality and visual design>

- Regular Expressions: Detecting if the player clicked A-D on the keypad or 1-3

- Mouse or keyboard interaction: Clicking on the keypad and pressing 'f' to cycle the shown food

- Geometric context: mainly using push(), pop() and translate(), eg: in the drawVendMachine

- Loading images: the food/products and the drawn hands and alien 
(all the food pictures are taken by us and the alien is drawn by us as well)

- Direct manipulation of one or more objects: dragging coins into the machine

- DOM-based User interface widgets (buttons, sliders, text fields): Title screen menu with the start button and back button

- Using one of the libraries explored in CS 106: RiTa, Matter.js, and ML5.js: Using Matter.js to simulate physics on the items dropping

- Using easing functions for object or UI motion: Making the wallet opening animation

RELEASE
I <type your full name> grant permission to CS 106 course staff to use
my Final Project program and video for the purpose of promoting CS 106.
<if you don't grant permission, erase the line above>
*/

// all code goes below here ....

let engine; // Matter.js

let gameStart = false;

// Colours
const coinColour = "#E1960F";
const vendColourOutside = "#3B2F4B";
const vendColourRSide = "#6452B4";
const vendColourBack = "#292429";
const screenColour = "#779864";
const alienColour = "#EBC45C";
const walletColour = "#6B443B";
const vendKeyColour = "#949494";
const outlineColour = "#251E33";
const bgColour = "#425C71";

// Selection of item, keypad
let keypadScreenInfo = "";
let selectedNum = "0";
let selectedLet = "";
let selectedProduct = -1;
let codeEntered = false;
let droppingItem = false;
let hoveringKeyButton = -1;
let clickedButton;

// Objects
let products = [
  {
    name: "brookside", // same as the image file
    price: 4.0,
    code: "A1",
    weight: 3, // weight determines how fast it drops
  },
  {
    name: "buldak",
    price: 3.0,
    code: "B1",
    weight: 2,
  },
  {
    name: "sweetCornChips",
    price: 3.0,
    code: "C1",
    weight: 1,
  },
  {
    name: "hichew",
    price: 3.0,
    code: "D1",
    weight: 2,
  },
  {
    name: "lonelyGod",
    price: 3.0,
    code: "A2",
    weight: 1,
  },
  {
    name: "mangoGummy",
    price: 3.0,
    code: "B2",
    weight: 2,
  },
  {
    name: "matchaCroissant",
    price: 4.0,
    code: "C2",
    weight: 3,
  },
  {
    name: "milkDots",
    price: 2.0,
    code: "D2",
    weight: 2,
  },
  {
    name: "pineappleBun",
    price: 2.0,
    code: "A3",
    weight: 2,
  },
  {
    name: "pocky",
    price: 4.0,
    code: "B3",
    weight: 1,
  },
  {
    name: "ritz",
    price: 3.0,
    code: "C3",
    weight: 3,
  },
  {
    name: "shinRamyun",
    price: 3.0,
    code: "D3",
    weight: 2,
  },
];
let keypad = [
  {
    keyChar: "A",
    row: 0,
    column: 0,
    w: 1,
    h: 1,
  },
  {
    keyChar: "B",
    row: 1,
    column: 0,
    w: 1,
    h: 1,
  },
  {
    keyChar: "C",
    row: 2,
    column: 0,
    w: 1,
    h: 1,
  },
  {
    keyChar: "D",
    row: 3,
    column: 0,
    w: 1,
    h: 1,
  },
  {
    keyChar: "1",
    row: 0,
    column: 1,
    w: 1,
    h: 1,
  },
  {
    keyChar: "2",
    row: 1,
    column: 1,
    w: 1,
    h: 1,
  },
  {
    keyChar: "3",
    row: 2,
    column: 1,
    w: 1,
    h: 1,
  },
  {
    keyChar: "CLR",
    row: 4,
    column: 0,
    w: 1,
    h: 1,
  },
  {
    keyChar: "ENTER",
    row: 5,
    column: 0,
    w: 2.1,
    h: 1,
  },
  {
    keyChar: "|", // coin slot
    row: 3,
    column: 1,
    w: 1,
    h: 2.1,
  },
];
let keypadButtons = [];
let foodLocations = [];
let droppedFood = []; // interactable
let heldFood = []; // on the palm
let shownFood = 0; // index of the one shown on the palm
let hoveringFood = -1;

// DOM buttons
let startButton;
let backButton;

// Physics barriers
let vendBottom, vendLWall, vendRWall;

// Images
let alienImg, alienPalmImg;
let foodImages = []; // follows the same index as products
let handPointImg, handOpenImg, handGrabImg;

// Location and size of elements
const keypadPanelWidth = 400;
const vendX = 50;
const vendY = 20;
let alienImgX;
const alienImgStartX = 200;
const walletX = 100;
const walletY = 680;
const walletW = 100;
const walletH = 80;

// Easing
let alienT = 0;
let alienInc = -1 / 60;
  // Coins
let t = 0; 
let inc = -1 / 60; 

// Coins and wallet
const numCoins = 12;
let coins = [];
let dragging = -1;
let walletOpened = -1;
let coinsEntered = 0;
let hoveringWallet = false;

function preload() {
  for (let i = 0; i < products.length; i++) { 
    // when copying this to the submissions, just remove all the "images/" parts
    foodImages.push(loadImage("images/" + products[i].name + ".png"));
  }

  alienImg = loadImage("images/alien.png");
  alienPalmImg = loadImage("images/alienPalm.png");
  handPointImg = loadImage("images/handPoint.png");
  handOpenImg = loadImage("images/handOpen.png");
  handGrabImg = loadImage("images/handGrab.png");
}

function setup() {
  engine = Matter.Engine.create();
  createCanvas(1000, 800);
  background(bgColour);
  createKeypadButtons();
  createButtons();
  backToStart();
  createBarriers(vendX, vendY);
}

function createCoins(){
  coins = [];
  for (let idx = 0; idx < numCoins; ++idx) {
    let r = 20;
    coins.push({
      offset: createVector(
        random(r, walletW - r),
        random(r, walletH - r)
      ),
      radius: r
    });
  }
}

// Creates the physics barriers for the vending machine at x, y
function createBarriers(x, y) {
  vendLWall = createRect(x - 40, y, 30, 560);
  vendRWall = createRect(x + 310, y, 30, 560);
  vendBottom = createRect(x, y + 520, 500, 40);
  Matter.Body.setStatic(vendLWall.body, true);
  Matter.Body.setStatic(vendRWall.body, true);
  Matter.Body.setStatic(vendBottom.body, true);
}

// Creates keypad button objects from the keypad array
// The keypad array has position that is relative
// The keypadButtons array would have the position at the actual pixel of the screen
function createKeypadButtons() {
  const keypadButtonMultiplier = 100;
  for (let i = 0; i < keypad.length; i++) {
    keypadButtons.push({
      label: keypad[i].keyChar,
      x: keypadButtonMultiplier * keypad[i].column + keypad[i].column * 10, // before translation
      y: keypadButtonMultiplier * keypad[i].row + keypad[i].row * 10,
      w: keypadButtonMultiplier * keypad[i].w,
      h: keypadButtonMultiplier * keypad[i].h,
    });
  }
}

function draw() {
  Matter.Engine.update(engine);
  
  if (gameStart) {
    simulator();
  } else {
    startingScreen();
  }
}

// Game going
function simulator() {
  hoveringWallet = false;
  hoveringKeyButton = -1;
  hoveringFood = -1;
  t += inc;
  t = constrain(t, 0, 1);
  
  background(bgColour);
  drawVendMachine(vendX, vendY);
  drawSideKeypad(width - keypadPanelWidth, 0);
  detectWallet();
  detectVendFood();

  if (codeEntered) {
    buyItem();
  }

  drawDropped();
  drawAlienPalm();
  drawVendSeperator(vendX, vendY);
  drawWallet(walletX, walletY);
  drawCursor();
}

// Draw dropped items in the vending machine
function drawDropped() {
  for (let i = 0; i < droppedFood.length; i++) {
    image(foodImages[droppedFood[i].productIndex], 
          droppedFood[i].body.position.x, 
          droppedFood[i].body.position.y, 80, 80);
  }
}

// Creates the startButton and backButton
function createButtons() {
  startButton = createButton("Start Game");
  startButton.mouseClicked(startGame);
  startButton.size(200, 40);
  startButton.position(140, 275);
  startButton.style("font-size", "30px");
  startButton.style("background-color", "#66C2FF"); 
  startButton.style("border", '4px solid' + outlineColour); 
  startButton.style("color", outlineColour); 
  
  backButton = createButton("Back to Start");
  backButton.mouseClicked(backToStart);
  backButton.size(200, 30);
  backButton.position(10, 10);
  backButton.style("font-size", "20px");
  backButton.style("background-color", "#66C2FF"); 
  backButton.style("border", '3px solid' + outlineColour); 
  backButton.style("color", outlineColour); 
}

// Begins the simulator, resets the variables
function startGame() {
  gameStart = true;
  droppedFood = [];
  heldFood = [];
  keypadScreenInfo = "";
  selectedNum = "0";
  selectedLet = "";
  selectedProduct = -1;

  coinsEntered = 0;
  codeEntered = false;
  droppingItem = false;
  
  t = 0; 
  inc = -1 / 60; 
  
  startButton.hide();
  backButton.show();
  noCursor();
}

// Returns to start menu
function backToStart() {
  cursor();
  alienImgX = alienImgStartX;
  gameStart = false;
  createCoins();
  alienT = 0;
  alienInc = -1 / 60;
  startButton.show();
  backButton.hide();
}

// Draws the start menu
function startingScreen() {
  background(bgColour);
  
  if (alienImgX > 0) { // Alien sliding in from the right side
    alienT -= alienInc;
    alienT = constrain(alienT, 0, 1);
    alienImgX = lerp(alienImgStartX, 0, easeOutBounce(alienT)); 
  } 
  image(alienImg, alienImgX, 0, width, height);
  
  push();
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  stroke(outlineColour);
  strokeWeight(8);
  fill("#66C2FF");
  textSize(48);
  text("Vending Machine\nTraining Simulator", 32, 200);
  pop();
}

// Draws the alien's palm and the foods that are held
function drawAlienPalm() {
  const alienPalmW = 265;
  const alienPalmH = 250;
  
  const foodX = width / 2 - alienPalmW + 80;
  const foodY = height - alienPalmH + 70;
  
  image(alienPalmImg, width / 2 - alienPalmW, height - alienPalmH, alienPalmW, alienPalmH);
  
  if (heldFood.length > 0) {
    image(foodImages[heldFood[shownFood].productIndex], foodX, foodY, 100, 100);
    
    push();
    textAlign(CENTER, CENTER);
    stroke(outlineColour);
    strokeWeight(4);
    textStyle(BOLD);
    fill(255);
    textSize(20);
    text("Food Obtained: " + (shownFood + 1) + "/" + heldFood.length, foodX + 50, foodY + 120);
    if (heldFood.length > 1) {
      strokeWeight(3);
      textSize(18);
      text("Press 'f' to cycle food view", foodX + 50, foodY + 148);
    }
    pop();
  } 
}

// Moves food from the vending machine to the hand
function vendToHand(idx) {
  heldFood.push(droppedFood[idx]);
  Matter.Composite.remove(engine.world, droppedFood[idx].body);
  droppedFood = removeFromArray(droppedFood, idx);
}

// Detect when user clicks on a dropped item
function detectVendFood() {
  const mouseP = createVector(mouseX, mouseY);
  for (let i = 0; i < droppedFood.length; i++) {
    const foodP = createVector(droppedFood[i].body.position.x + 40, 
                               droppedFood[i].body.position.y + 40);
    
    if (hitTestCircle(mouseP, foodP, droppedFood[i].radius)) {
      hoveringFood = i;
      return;
    }
  }
  hoveringFood = -1;
}

// Removes an element at index (idx) and returns a new array without it
function removeFromArray(array, idx) {
  let newArray = [];
  
  for (let i = 0; i < array.length; i++) {
    if (i !== idx) {
      newArray.push(array[i]);
    }
  }
  return newArray;
}

// Draws an input keypad at x, y
function drawSideKeypad(x, y) {
  push();
  translate(x, y);

  stroke(outlineColour);
  strokeWeight(3);

  fill(vendColourBack);
  rect(0, 0, keypadPanelWidth, height);

  drawKeypadScreen(20, 35);
  drawKeypadButtons(20 + 75, 35 + 125);

  detectKeypadButtons(x + 20 + 75, y + 35 + 125);
  pop();
}

// Detects hovering of keypad buttons
function detectKeypadButtons(x, y) {
  for (let i = 0; i < keypadButtons.length; i++) {
    const buttonX = keypadButtons[i].x + x;
    const buttonY = keypadButtons[i].y + y;

    if (mouseX >= buttonX && mouseX <= buttonX + keypadButtons[i].w &&
      mouseY >= buttonY && mouseY <= buttonY + keypadButtons[i].h &&
      keypadButtons[i].label !== "|") {
      hoveringKeyButton = i;
      return;
    }
  }
}

// Draws the buttons of the keypad
function drawKeypadButtons(x, y) {
  translate(x, y);
  for (let i = 0; i < keypadButtons.length; i++) {
    push();
    strokeWeight(5);
    fill(vendKeyColour);
    rect(
      keypadButtons[i].x,
      keypadButtons[i].y,
      keypadButtons[i].w,
      keypadButtons[i].h
    );

    strokeWeight(1);
    fill(outlineColour);
    if (keypadButtons[i].label.length <= 1) {
      textSize(70);
    } else {
      textSize(42);
    }
    textAlign(CENTER, CENTER);
    text(
      keypadButtons[i].label,
      keypadButtons[i].x + keypadButtons[i].w / 2,
      keypadButtons[i].y + keypadButtons[i].h / 2
    );
    pop();
  }
}

// Draws the keypad screen with the text of keypadScreenInfo
function drawKeypadScreen(x, y) {
  const keypadScreenWidth = keypadPanelWidth - 40;
  const keypadScreenHeight = 100;

  push();
  translate(x, y);
  strokeWeight(5);
  fill(screenColour);
  rect(0, 0, keypadScreenWidth, keypadScreenHeight);

  fill(outlineColour);
  strokeWeight(1);
  textSize(70);
  textAlign(CENTER, CENTER);
  text(keypadScreenInfo, keypadScreenWidth / 2, keypadScreenHeight / 2);

  pop();
}

// Changes the keypadScreenInfo and allows new keys to be entered
// Only called with mouse was clicked
function updateScreenInfo() {
  if (clickedButton.label === "CLR") {
    keypadScreenInfo = "";
    resetSelection();
  } else if (selectedLet === "") {
    // nothing selected yet
    if (clickedButton.label.search(/[A-D]/) !== -1) {
      // Regex
      selectedLet = clickedButton.label;
      keypadScreenInfo = selectedLet;
    } else {
      // clicked a number instead of letter
      keypadScreenInfo = "ONLY A-D";
    }
  } else if (selectedNum === "0") {
    // letter already selected, number not yet
    if (clickedButton.label.search(/[1-3]/) !== -1) {
      // selected number
      selectedNum = clickedButton.label;
      keypadScreenInfo += selectedNum;
    } else {
      // didn't click on number
      keypadScreenInfo = "RETRY";
      resetSelection();
    }
  }

  if (clickedButton.label === "ENTER") {
    if (
      keypadScreenInfo.search(/[A-D]/) !== -1 &&
      keypadScreenInfo.search(/[1-3]/) !== -1
    ) {
      findSelection(keypadScreenInfo);
      codeEntered = true;
    } else {
      keypadScreenInfo = "RETRY";
      resetSelection();
    }
  }
}

// Reset's user's selected keycode
function resetSelection() {
  print("selection reset");
  selectedLet = "";
  selectedNum = "0";
  codeEntered = false;
  coinsEntered = 0;
}

// Set the selectedProduct according to the code entered
function findSelection(code) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].code === code) {
      selectedProduct = i;
      print(products[i]);
      i = products.length; // end loop
    }
  }
}

// In the process of buying selectedProduct
function buyItem() {
  if (coinsEntered >= products[selectedProduct].price) {
    keypadScreenInfo = "drop: " + products[selectedProduct].code;
    droppedFood.push(createBall(80, selectedProduct));
    droppingItem = true;
    resetSelection();
  } else {
    keypadScreenInfo = 
      products[selectedProduct].code + ": $" + 
      (products[selectedProduct].price - coinsEntered) + " left";
  }
}

function hitTestRect(test, corner, w, h) {
  if (
    test.x >= corner.x &&
    test.x <= corner.x + w &&
    test.y >= corner.y &&
    test.y <= corner.y + h
  ) {
    return true;
    print("hit");
  }
  return false;
}

// Draw a hand that follows the cursor.
function drawCursor() {
  const CURSOR_SIZE = 80;
  const drawMouseX = mouseX - 20; // so the tip of the pointer finger is on the cursor
  const drawMouseY = mouseY - 15;
  if (mouseIsPressed) {
    image(handGrabImg, drawMouseX, drawMouseY, CURSOR_SIZE, CURSOR_SIZE);
  } else if (hoveringKeyButton !== -1 || hoveringWallet || hoveringFood !== -1) {
    image(handOpenImg, drawMouseX, drawMouseY, CURSOR_SIZE, CURSOR_SIZE);
  } else {
    image(handPointImg, drawMouseX, drawMouseY, CURSOR_SIZE, CURSOR_SIZE);
  }
}

// Draws the food inside the vending machine
function drawFoodInside(x, y) {
  const imageSide = 80;
  const spaceBetween = 100;
  const labelW = 40;
  const labelH = 20;

  push();
  translate(x, y);
  strokeWeight(1);
  textSize(18);
  textAlign(CENTER, CENTER);

  let index = 0;
  for (let c = 0; c < 3; c++) {
    // columns
    for (let r = 0; r < 4; r++) {
      image(
        foodImages[index],
        c * spaceBetween + 10,
        r * spaceBetween + 10,
        imageSide,
        imageSide
      );
      fill(vendColourRSide);
      rect(c * spaceBetween + 30, r * spaceBetween + 80, labelW, labelH);
      fill(outlineColour);
      text(products[index].code, c * spaceBetween + 50, r * spaceBetween + 92);
      index++;
      foodLocations.push(
        createVector(c * spaceBetween + 10, r * spaceBetween + 10)
      );
    }
  }

  pop();
}

// Draw the vending machine
function drawVendMachine(x, y) {
  push();
  translate(x, y);
  // machine
  myrect(0, 0, 500, 600, vendColourOutside);
  myrect(30, 40, 320, 400, vendColourBack); // holds the food
  myrect(30, 460, 320, 100, vendColourBack); // bottom
  myrect(350, 40, 120, 400, vendColourRSide);

  drawFoodInside(30 + 10, 40);

  // keypad
  myrect(370, 130, 80, 237.5, vendColourBack);
  myrect(375, 135, 70, 30, screenColour);
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 5; j++) {
      myrect(380 + 32.5 * i, 170 + 32.5 * j, 27.5, 27.5, vendKeyColour);
    }
  }
  myrect(412.5, 267.5, 27.5, 60, vendKeyColour);
  myrect(380, 332.5, 60, 27.5, vendKeyColour);
  pop();
}

function myrect(x, y, w, h, colour) {
  push();
  fill(colour);
  rect(x, y, w, h);
  pop();
}

// Draw part between the viewing part and grabbing part of the vending machine
function drawVendSeperator(x, y) {
  push();
  translate(x, y);
  strokeWeight(1);
  fill(vendKeyColour);
  
  rect(0, 440, 500, 20);
  
  pop();
}

function keyPressed() {
  if (key === "f") {
    shownFood++;
    if (shownFood >= heldFood.length) {
      shownFood = 0;
    }
  }
}

function mouseClicked() {
  if (hoveringKeyButton !== -1 && !codeEntered) {
    clickedButton = keypadButtons[hoveringKeyButton];
    print(clickedButton.label + " clicked");
    updateScreenInfo();
  }
  
  if (hoveringFood !== -1) {
    vendToHand(hoveringFood);
  }
  
  if (codeEntered && clickedButton.label === "CLR") {
    keypadScreenInfo = "";
    resetSelection();
    print("clicked CLR");
  }
}

function mousePressed() {
  if (hoveringWallet) {
    openWallet();
  }
}

function mouseReleased() {
  if (dragging !== -1) {
    let lastkey = keypadButtons[keypadButtons.length - 1];
    if (mouseX >= (lastkey.x + 95 + (width - keypadPanelWidth)) && 
        mouseX <= (lastkey.x + lastkey.w + 95 + (width - keypadPanelWidth)) && 
        mouseY >= (lastkey.y + 160) && 
        mouseY <= (lastkey.y + lastkey.h + 160)) {
      coinsEntered++;
      print("coin entered");
      coins = removeFromArray(coins, dragging);
    }
    dragging = -1;
  }
}

// Detect hovering over wallet
function detectWallet() {
  if (mouseX >= walletX && mouseX <= walletX + walletW &&
      mouseY >= walletY && mouseY <= walletY + walletH) {
    hoveringWallet = true;
    return true;
  }
  return false;
}

// Opening animation of wallet and move coins
function openWallet() {
  // only grab when wallet is open
  if (t < 0.8) {
    inc = -inc; // still allow opening/closing
    return;
  }

  const mouseP = createVector(mouseX, mouseY);
  for (let idx = coins.length - 1; idx >= 0; --idx) {
    const c = coins[idx];

    // convert coin position to screen space
    let coinPos = createVector(
      walletX + c.offset.x,
      walletY + c.offset.y);

    if (hitTestCircle(mouseP, coinPos, c.radius)) {
      dragging = idx;
      return;
    }
  }

  // if no coin clicked → toggle wallet
  inc = -inc;
}

function drawWallet(x, y) {
  push();
  translate(x, y);
  myrect(0, 0, walletW, walletH, walletColour);
  
  if (dragging !== -1) {
    const coin = coins[dragging];
    coin.offset.x += mouseX - pmouseX;
    coin.offset.y += mouseY - pmouseY;
  }
  
  if (t > 0.05) {
    drawCoins(0, 0);
  }
  myrect(0, 0, 100 * (1 - easeInOutCubic(t)), 80, walletColour);
  pop();
}

function drawCoins(x, y) {
  for (let i = 0; i < coins.length; i++) {
    let c = coins[i];

    // only constrain if NOT being dragged
    if (i !== dragging) {
      c.offset.x = constrain(c.offset.x, c.radius, 100 - c.radius);
      c.offset.y = constrain(c.offset.y, c.radius, 80 - c.radius);
    }

    fill(coinColour);
    circle(
      x + c.offset.x,
      y + c.offset.y,
      c.radius * 2
    );
  }
}

function hitTestCircle(test, centre, radius) {
  return test.dist(centre) <= radius;
}

// Matter composite, rectangle with top-left corner at x, y
function createRect(x, y, w, h) {
  const newBody = Matter.Bodies.rectangle(x + w / 2, y + h / 2, w, h);
  Matter.Composite.add(engine.world, newBody);

  return {
    body: newBody,
    w: w,
    h: h,
  };
}

// Matter composite, circle
function createBall(d, index) {
  const newBody = Matter.Bodies.circle(foodLocations[index].x + d, foodLocations[index].y + d, d / 2);
  Matter.Composite.add(engine.world, newBody);

  return {
    body: newBody,
    radius: d / 2,
    productIndex: index,
  };
}

function easeInOutCubic(t) {
  if (t < 0.5) {
    return 4 * t * t * t;
  } else {
    const t2 = -2 * t + 2;
    return 1 - (t2 * t2 * t2) / 2;
  }
}

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
}
