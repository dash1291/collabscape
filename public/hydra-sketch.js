var hydra = new Hydra({
    canvas: document.getElementById("hydraCanvas")
})
var audioContext = Tone.context;
hydra.setResolution(1920, 1080)
shape(() => (Math.sin(time * 0.00125) * 3.5 + 3.5), 0.25).repeat(4, 4).scrollY(0, -0.0125).out(o1)
src(o1)
    .add(
        src(o1)
        .scrollX(0.25 * 0.25)
        .scrollY(0, 0.0125).scale(a.fft[2])
    )
    .kaleid(() => (Math.sin(time * 0.0001) * 6 + 3)).blend(src(o0).scale(0.75).kaleid(), 0.9)
    .diff(src(o0).scale(0.9).luma(() => a.fft[2] * 1.7))
    .scrollY(() => (Math.sin(time) * 0.01)).rotate(0.012)
    .contrast(1).out()