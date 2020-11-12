var WIDTH = window.innerWidth - 50;
var HEIGHT = window.innerHeight - 100;
var bgColor = '#0c1a21'
var lastTransmittedPos = {}

let q5 = new Q5();
q5.setup = function () {
    // if (window.innerHeight < HEIGHT) {
    //     HEIGHT = window.innerHeight * 0.7
    // }
    // WIDTH = window.innerWidth - 420

    q5.createCanvas(WIDTH, HEIGHT)
    q5.frameRate(30)
    q5.createGraphics(WIDTH, HEIGHT)
    q5.background(bgColor)
    q5.colorMode(q5.HSL);
}

q5.draw = function () {
    q5.background(bgColor)

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
        q5.fill(h, 80, 80, 1 - 0.8 * r / 110)
        q5.circle(usersPos[i].x * WIDTH, usersPos[i].y * HEIGHT, r);
    })

    // movement
    if (q5.keyIsDown(q5.UP_ARROW)) {
        usersPos[userId].y = Math.max(usersPos[userId].y - 10 / HEIGHT, 0)
    }

    if (q5.keyIsDown(q5.DOWN_ARROW)) {
        usersPos[userId].y = Math.min(usersPos[userId].y + 10 / HEIGHT, 1)
    }

    if (q5.keyIsDown(q5.LEFT_ARROW)) {
        usersPos[userId].x = Math.max(usersPos[userId].x - 10 / WIDTH, 0)
    }

    if (q5.keyIsDown(q5.RIGHT_ARROW)) {
        usersPos[userId].x = Math.min(usersPos[userId].x + 10 / WIDTH, 1)
    }
}

// interval for detecting movement. highly conditional to avoid
// bombarding the audio changes
setInterval(() => {
    let hasXYChanged = false;
    let areKeysDown = false;
    areKeysDown = q5.keyIsDown(q5.UP_ARROW) || q5.keyIsDown(q5.DOWN_ARROW) || q5.keyIsDown(q5.LEFT_ARROW) || q5.keyIsDown(q5.RIGHT_ARROW);
    // if (userId === Number(i)) {
    //     hasXYChanged = (usersPos[userId].x != lastTransmittedPos.x) || (usersPos[userId].y != lastTransmittedPos.y)
    // }

    if (!areKeysDown && hasXYChanged) {
        const userXY = usersPos[userId];
        audio.onPositionChange(userXY, {
            x: mouseX,
            y: mouseY
        })

        socket.onPositionChange(userXY);

        lastTransmittedPos = {
            x: usersPos[userId].x,
            y: usersPos[userId].y
        }
    }
}, 1000)