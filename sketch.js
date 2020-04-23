let att = 0.99;
let nBalls = 30;
let balls = [];
let type = 'sine';
let bFreq = 110;
let gravity;
let stop = false;

let ADSR = {
  attackTime: 0.5,
  decayTime: 0.5,
  susPercent: 0.2,
  relTime: 4.0,
  attackLvl: 0.5,
  relLvl: 0.0
};

function setup() {
  /* DDC PORCODDIO DDC */
  createCanvas(windowWidth, windowHeight);
  //createCanvas(400, 400);
  //fullScreen();
  //frameRate(10);
  gravity = createVector(0, 0);

  for (let i = 0; i < nBalls; i++) {
    let os = new p5.Oscillator(bFreq * i, type);
    let en = new p5.Envelope();
    en.setADSR(ADSR.attackTime, ADSR.decayTime, ADSR.susPercent, ADSR.relTime);
    en.setRange(ADSR.attackLvl, ADSR.relLvl);

    let c = color(random(255), random(255), random(30));

    let b = new Ball(random(width), random(height), i + 1, os, en, i, c);
    balls.push(b);
  }

}

function draw() {
  background(0);
  //textAlign(CENTER, CENTER);
  // textSize(40);
  //text("DDC", width / 2, height / 2);
  balls.forEach(updateBalls);
}

function keyPressed() {
  if (key == ' ') stop = !stop;
}

function updateBalls(e) {
  if (!stop) e.applyForce(gravity);
  for (let i = 0; i < nBalls; i++) e.check(balls[i]);
  e.show();
}