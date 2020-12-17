if (typeof (isMobile) != undefined) {
  if (isMobile) {
      var q5M = new p5(function (p5) {
      p5.disableFriendlyErrors = true;
      p5.setup = function () {
        p5.createCanvas(WIDTH, HEIGHT)
        p5.frameRate(3)
        p5.background(bgColor)
        p5.colorMode(p5.HSL);
      }

      p5.draw = function () {
        p5.background(bgColor);
        // randomShape(WIDTH / 2, HEIGHT / 2, 100); // To check the shape function
        // set number of "spokes" like the radius of a wheel by dividing TWO_PI

        // var spokes = p5.TWO_PI / 8; //(panel.getValue('number of radii'));
        // // draw a set of spokes with a given angle
        // for (var a = 0; a < p5.TWO_PI; a += spokes) {
        //   p5.strokeWeight(2);
        //   ellipseSpoke(a);
        //   p5.strokeWeight(1);
        // }
      }
    }, document.getElementById("mobileCanvas"));

    const spokeLoop = new Tone.Loop((time) => {
      Tone.Draw.schedule(() => {
        q5M.stroke(0, 0, 100);
        q5M.strokeWeight(2);
        spoke(8);
        q5M.strokeWeight(2);
      }, time);
    }, "8n").start();
  }
}

    function spoke(spoke) {
      var spokes = q5M.TWO_PI / spoke; //(panel.getValue('number of radii'));

      // draw a set of spokes with a given angle
      for (var a = 0; a < q5M.TWO_PI; a += spokes) {
        ellipseSpoke(a);
      }
    }

    function randomShape(x, y, size) {
      //get a random value between 0 and 1
      // if (tracks[0].currentNote != undefined) {
      //   var randomValue = q5M.map(tracks[0].currentNote, 00, 18000, 0, 1);
      // } else var randomValue = 0;
      var randomValue = q5M.random();

      //   q5M.text(randomValue, WIDTH / 2, HEIGHT / 2)
      q5M.noFill();
      q5M.stroke(0, 0, 50);
      if (randomValue < 0.1) {
        q5M.ellipse(x, y, size);
      } else if (randomValue < 0.2) {
        q5M.ellipse(x, y, size / 3, size / 3);
      } else if (randomValue < 0.3) {
        //X's
        var len = size * q5M.random(0.2, 0.5);
        q5M.line(x - len, y - len, x + len, y + len);
        q5M.line(x + len, y - len, x - len, y + len);
      } else if (randomValue < 0.4) {
        //crosses
        q5M.line(x, y - size / 3, x, y + size / 3);
        q5M.line(x - size / 3, y, x + size / 3, y);
      } else if (randomValue < 0.6) {
        //ovals
        q5M.ellipse(x, y, size * q5M.random(0.25, 0.8), size * q5M.random(0.25, 1));
      } else if (randomValue < 0.7) {
        //horizontal lines
        var len2 = size * q5M.random(0.2, 0.5);
        q5M.line(x - len2, y - len2, x + len2, y - len2);
        q5M.line(x - len2, y + len2, x + len2, y + len2);
      } else if (randomValue < 0.8) {
        //vertical lines
        var len3 = size * q5M.random(0.2, 0.5);
        q5M.line(x - len3, y - len3, x - len3, y + len3);
        q5M.line(x + len3, y - len3, x + len3, y + len3);
      } else if (randomValue < 0.9) {
        //center point
        q5M.point(x, y);
      } else {
        //4 points at random distance
        var len4 = size * q5M.random(0.1, 0.4);
        q5M.point(x - len4, y - len4);
        q5M.point(x + len4, y - len4);
        q5M.point(x + len4, y + len4);
        q5M.point(x - len4, y + len4);
      }
      q5M.noStroke();
    }

    //draw a "spoke" of ellipses with each ellipse center moving away from the center of the canvas
    //the function takes an angle of rotation
    function ellipseSpoke(rotation) {
      //get values
      var step = 10; //panel.getValue('distance between centers')
      var offset = -3; //panel.getValue('center offset');

      q5M.push();
      q5M.translate(WIDTH / 2, HEIGHT / 2);
      q5M.rotate(rotation);
      for (var r = step; r < HEIGHT * 0.12; r += step) {
        // q5M.ellipse(0, r * offset, r, r);
        randomShape(0, r * offset, r);
      }
      q5M.pop();
    }