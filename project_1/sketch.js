let recMode = false;
let can;
let circdot1, circdot2, lSystem;
let ellipseSize = 10;
let greenValue = 0;

function setup() {
  //rectMode(CENTER);

  can = createCanvas(1920, 1080);
  background(0);
  stroke(0, 0, 0, 255);
  frameRate(45);
  circdot1 = new Circdot(width / 2, height / 2, 50, 90, 1);
  circdot2 = new Circdot(width / 2, height / 2, 50, 90, -1);
  const rules = [
    ['A', '-BF+AFA+FB-'],
    ['B', '+AF-BFB-FA+'],
  ];
  lSystem = new LSystem(rules, 'A');

  for (let i = 0; i < 5; i++) {
    lSystem.generate();
  }
  //noLoop();
}

let rectWidth = 1000;
let rectHeight = 800;

function draw() {
  if (frameCount == 1 || frameCount == 351 || frameCount == 701) {
    background(50);
  }

  if (frameCount <= 350) {
    background(50, 10);
    greenValue += 10;
  } else if (frameCount <= 700) {
    let growthFactor = map(frameCount, 301, 600, 0, width * 0.5); 
    fill(50, 10);
    rect((width - growthFactor) / 2, (height - growthFactor) / 2, growthFactor, growthFactor); 
    changeRules();
  } else {
    circdot1.step = 100;  
    circdot1.angle = 35;
    circdot2.step = 50;
    circdot2.angle = 35;
  }

  drawIt(circdot1, lSystem.thestring[circdot1.whereinstring]);
  drawIt(circdot2, lSystem.thestring[circdot2.whereinstring]);

  circdot1.whereinstring++;
  circdot2.whereinstring++;
  if (circdot1.whereinstring > lSystem.thestring.length - 1) circdot1.whereinstring = 0;
  if (circdot2.whereinstring > lSystem.thestring.length - 1) circdot2.whereinstring = 0;

  //recordit();
  console.log(frameCount);
}




class Circdot {
  constructor(x, y, step, angle, direction = 1) {
    this.x = x;
    this.y = y;
    this.currentangle = 0;
    this.step = step;
    this.angle = angle;
    this.direction = direction;
    this.whereinstring = 0;
  }

  moveForward() {
    let startX = this.x;
    let startY = this.y;

    let x1 = this.x + this.step * cos(radians(this.currentangle));
    let y1 = this.y + this.step * sin(radians(this.currentangle));

    if (x1 < 0) {
      x1 = width;
      ellipseSize = 10;
    } else if (x1 > width) {
      x1 = 0;
      ellipseSize = 10;
    }

    if (y1 < 0) {
      y1 = height;
      ellipseSize = 10;
    } else if (y1 > height) {
      y1 = 0;
      ellipseSize = 10;
    }

    line(startX, startY, x1, y1);
    this.x = x1;
    this.y = y1;
  }

  turnLeft() {
    this.currentangle += this.angle * this.direction;
  }

  turnRight() {
    this.currentangle -= this.angle * this.direction;
  }
}

class LSystem {
  constructor(rules, axiom) {
    this.rules = rules;
    this.thestring = axiom;
  }

  generate() {
    let outputstring = '';

    for (let i = 0; i < this.thestring.length; i++) {
      let ismatch = false;
      for (let rule of this.rules) {
        if (this.thestring[i] == rule[0]) {
          outputstring += rule[1];
          ismatch = true;
          break;
        }
      }
      if (!ismatch) outputstring += this.thestring[i];
    }

    this.thestring = outputstring;
    return this.thestring;
  }
}

function changeRules() {
  lSystem.rules[0] = ['A', '+BF-AFA-FB+'];
  lSystem.rules[1] = ['B', '-AF+FBF+FA-'];
  circdot1.angle = 60;
  circdot2.angle = 60;
  circdot1.step = 50;
  circdot2.step = 50;
}

function drawIt(circdot, k) {
  if (k == 'F') {
    let startX = circdot.x;
    let startY = circdot.y;
    circdot.moveForward();
    let endX = circdot.x;
    let endY = circdot.y;
    line(startX, startY, endX, endY);
    mirrorShapes(circdot);

    push();
    scale(-1, 1);
    translate(-width, 0);
    line(startX, startY, endX, endY);
    mirrorShapes(circdot);
    pop();
  } else if (k == '+') {
    circdot.turnLeft();
  } else if (k == '-') {
    circdot.turnRight();
  }
}

function EsDots(x, y, size, color) {
  fill(color);
  noStroke();
  ellipse(x, y, size, size);
}

function mirrorShapes(circdot) {
  if (frameCount > 700) {
    push();
    translate(circdot.x / 40, circdot.y / 40);
    EsDots(circdot.x, circdot.y, ellipseSize, color(28, 255, 5, 200));
    EsDots(circdot.x + 20, circdot.y + 20, ellipseSize * 0.8, color(0, 0, 255, 200));
    EsDots(circdot.x - 20, circdot.y - 20, ellipseSize * 0.8, color(0, 255, 255, 200));
    EsDots(circdot.x - 20, circdot.y - 40, ellipseSize * 0.7, color(255, 20, 55, 200));
    EsDots(-circdot.x - 80, -circdot.y - 60, ellipseSize * 0.9, color(255, 20, 55, 200));
    EsDots(circdot.x - 80, circdot.y - 80, ellipseSize * 0.5, color(255, 255, 0));

    ellipseSize += 0.9;
    pop();

  } else if (frameCount > 350) {
    fill(135, greenValue, 235, 200);
    ellipse(circdot.x, circdot.y, 50, 50, 10);
    stroke(255);
    strokeWeight(2);
    line(circdot.x, circdot.y, width / 2, height / 2);

  } else {
    let radius = random(10, 50);
    EsDots(circdot.x, circdot.y, radius, color(64, greenValue, 208));
    EsDots(circdot.x - 2, circdot.y - 2, radius - 2, color(244, 0, 0));
    EsDots(circdot.x - 4, circdot.y - 6, radius - 24, color(0, 244, 0));
    EsDots(circdot.x - 6, circdot.y - 8, radius - 16, color(100, 150, 0));
  }
}

function keyPressed() {
  if (keyIsPressed === true) {
    let k = key;
    console.log("k is " + k);

    if (k == 's' || k == 'S') {
      console.log("Stopped Recording");
      recMode = false;
      noLoop();
    }

    if (k == ' ') {
      console.log("Start Recording");
      recMode = true;
      loop();
    }
  }
}

function recordit() {
  if (recMode == true) {
    let ext = nf(frameCount, 4);
    saveCanvas(can, 'anim/frame-' + ext, 'jpg');
    console.log("rec " + ext);
  }
}
