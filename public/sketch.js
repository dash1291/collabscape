var WIDTH = 800
var HEIGHT = 600
var bgColor = '#0c1a21'
var usersPos = {}
var lastTransmittedPos = {}

function setup () {
  if (windowHeight < HEIGHT) {
    HEIGHT = windowHeight * 0.7
  }
  WIDTH = windowWidth - 420

  createCanvas(WIDTH, HEIGHT).parent('sketch-canvas')

  frameRate(30)
  createGraphics(WIDTH, HEIGHT)
  background(bgColor)
  colorMode(HSL);
}

function draw() {
  background(bgColor)
  
  // blink effect for each dot starts below
  Object.keys(usersPos).forEach(i => {
    let r = 0
    let playedSince = ((+new Date()) - (usersPos[i].playedAt || 0));
    if (playedSince > 100 || playedSince < 0) {
      r = 10
    } else {
      r = 10 + 100 * Math.sin((Math.PI / 100) * playedSince)
    }

    let h = 20
    if (userId === Number(i)) {
      h = 70
    }
    fill(h, 80, 80, 1 - 0.8 * r/110)
    circle(usersPos[i].x * WIDTH, usersPos[i].y * HEIGHT, r);
  })
  
  // movement
  if (keyIsDown(UP_ARROW)) {
    usersPos[userId].y = Math.max(usersPos[userId].y - 10/HEIGHT, 0)
  }
  
  if (keyIsDown(DOWN_ARROW)) {
    usersPos[userId].y = Math.min(usersPos[userId].y + 10/HEIGHT, 1)
  }
  
  if (keyIsDown(LEFT_ARROW)) {
    usersPos[userId].x = Math.max(usersPos[userId].x - 10/WIDTH, 0)
  }
  
  if (keyIsDown(RIGHT_ARROW)) {
      usersPos[userId].x = Math.min(usersPos[userId].x + 10/WIDTH, 1)
  }  
}


// interval for detecting movement. highly conditional to avoid
// bombarding the audio changes
setInterval(() => {
  let areKeysDown = keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)
  let hasXYChanged = (usersPos[userId].x != lastTransmittedPos.x) || (usersPos[userId].y != lastTransmittedPos.y)

  if (!areKeysDown && hasXYChanged) {
    instruments[userId % 13].panner.setPosition(usersPos[userId].x , usersPos[userId].y, 0)
    Tone.Listener.positionX = (usersPos[userId].x);
    Tone.Listener.positionY = (usersPos[userId].y);

    socket.emit('move', {
      userId: userId,
      position: usersPos[userId]
    })

    lastTransmittedPos = {
      x: usersPos[userId].x,
      y: usersPos[userId].y
    }    
  }
}, 1000)
