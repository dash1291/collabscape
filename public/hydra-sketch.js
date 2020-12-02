let hydra, hydraCanvas
// hydraCanvas = document.createElement("canvas")
// hydraCanvas.width = 512;
// hydraCanvas.height = 512;
// hydraCanvas.id = "hydraCanvas";
hydraCanvas = document.getElementById("hydraCanvas")
hydraCanvas.width = window.innerWidth - 20;
hydraCanvas.height = window.innerHeight - 20;
hydra = new Hydra({
    canvas: hydraCanvas,
    makeGlobal: false,
    detectAudio: false,
    width: 512,
    height: 512,
})//
p5 = document.getElementById("sketchCanvas")
let visFX = hydra.synth
visFX.s0.init({
    src: p5.canvas,
    dynamic: true // optional parameter. Set to false if using a static image or something that will not change
})

// 13 Nov 2020
visFX.src(visFX.s0) // This should pick up the canvas element from p5
// visFX.voronoi()
// visFX.solid().add(visFX.src(visFX.s0), 1)
    .modulateKaleid(visFX.voronoi(5, 0.01), [3, 9, 12].smooth().fast(0.125)).rotate(0, -0.1)
    .blend(visFX.src(visFX.o1).scrollY(0.001).scale(0.999), 0.99)
    // .color(0, 0, 3).colorama(0.4)
    .out(visFX.o1)
// var shader = visFX.src(visFX.o1).add(visFX.src(visFX.s0)).glsl()
// console.log(shader)
visFX.src(visFX.o1).add(visFX.src(visFX.s0)).out()