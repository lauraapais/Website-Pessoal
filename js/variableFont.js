let words = document.getElementById("lauraPais");

let getXPercentage = x => {
    return x / window.innerWidth;
};

let updateFontWeight = x => {
    // Calculate the new font weight, based on the current cursor position
    let xPercentage = getXPercentage(x);
    let fontWeight = 800 * xPercentage + 100;

    // Change the styling, creating a stagger using setTimeout & the index value
    words.forEach((letter, i) => {
        setTimeout(function() {
            letter.style.fontVariationSettings = "'wght' " + fontWeight;
        }, 120 * (i * 0.6));
    });
};

// Finally, set up the event-listener
document.body.addEventListener("mousemove", e => {
    let X = e.clientX;
    updateFontWeight(X);
});
