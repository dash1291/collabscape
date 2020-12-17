let WIDTH = window.innerWidth - 20;
let HEIGHT = window.innerHeight - 20;
let bgColor = '#333'
let lastTransmittedPos = {}
let moveDirection = '';
let dragging = false;

let q5S = new p5(function (q5) {
q5.setup = function () {
    q5.createCanvas(WIDTH, HEIGHT)
    q5.frameRate(30)
    q5.background(bgColor)
    q5.colorMode(q5.HSL);

    q5.textFont('bc-liguria');
    q5.textSize(16);
    q5.textAlign(q5.CENTER, q5.CENTER);
}

q5.draw = function () {
    q5.background(bgColor)

    if (usersPos != undefined) {
        // blink effect for each dot starts below
        Object.keys(usersPos).forEach(i => {
            let r = 0
            //console.log(i)
            // console.log(usersPos[i])
            let playedSince = ((+new Date()) - (usersPos[i].playedAt || 0));
            if (playedSince > 100 || playedSince < 0) {
                r = 10
            } else {
                r = 10 + 100 * Math.sin((Math.PI / 100) * playedSince)
            }
    
            let h = 20
            if (userId === Number(i)) {
                h = 70
                r += 50
            }

            if (usersPos[i].isArtifical) {
                h = 50
            }
            
            q5.fill(h, 80, 80, 1 - 0.8 * r / 110)
            q5.circle(usersPos[i].x * WIDTH, usersPos[i].y * HEIGHT, r);
            q5.noFill();
            q5.stroke(h, 80, 80, 1 - 0.8 * r / 110)
            q5.line(usersPos[i].x * WIDTH, usersPos[i].y * HEIGHT, usersPos[userId].x * WIDTH, usersPos[userId].y * HEIGHT)
            q5.noStroke();
            // q5.text(usersPos[i].x + ' x ' + usersPos[i].y, usersPos[i].x * WIDTH, usersPos[i].y * HEIGHT);
        })
    }

    if (tracks[0] != undefined) {
        q5.fill(255);
        q5.textSize(50);
        q5.textAlign(q5.CENTER, q5.CENTER);
        // if (tracks[0].currentNote != undefined) q5.text(tracks[0].currentNote, WIDTH / 2, HEIGHT / 2);
    }

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

    if (q5.mouseIsPressed) {
        if (q5.dist(usersPos[userId].x * WIDTH, usersPos[userId].y * HEIGHT, q5S.mouseX, q5S.mouseY) < 20) {
            dragging = true;
            // console.log('Dragging')
        }
    }

    // // In case dragging
    if (dragging) {
        usersPos[userId].x = q5.mouseX / WIDTH;
        usersPos[userId].y = q5.mouseY / HEIGHT;
    }
    q5.mouseReleased = function () {
        dragging = false;
    }
}
}, document.getElementById("sketchCanvas"));

// interval for detecting movement. highly conditional to avoid
// bombarding the audio changes
setInterval(() => {
    let hasXYChanged = false;
    let areKeysDown = false;
    areKeysDown = q5S.keyIsDown(q5S.UP_ARROW) || q5S.keyIsDown(q5S.DOWN_ARROW) || q5S.keyIsDown(q5S.LEFT_ARROW) || q5S.keyIsDown(q5S.RIGHT_ARROW);
    if (usersPos[userId]) {
        hasXYChanged = (usersPos[userId].x != lastTransmittedPos.x) || (usersPos[userId].y != lastTransmittedPos.y)
    }

    if (!areKeysDown && hasXYChanged) {
        const userXY = usersPos[userId];
        audio.onPositionChanged(userXY, {
            x: q5S.mouseX,
            y: q5S.mouseY
        })

        socket.onPositionChanged(userXY);
        masterlpf.frequency.value = Math.abs(q5S.map(usersPos[userId].y, 1, 0, 500, 18000));

        lastTransmittedPos = {
            x: usersPos[userId].x,
            y: usersPos[userId].y
        }
    }
}, 1000)