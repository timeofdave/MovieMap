

window.onload = function () {
    canvas = document.getElementById("mapCanvas");
    ctx = canvas.getContext("2d");
    canvasInfo = document.getElementById("infoCanvas");
    ctxInfo = canvas.getContext("2d");
    canvas.tabIndex = 0;

    inputTitle = document.getElementById("inputTitle");
    inputYear = document.getElementById("inputYear");

    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    canvas.addEventListener("keydown", keyPress);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('wheel', function (evt) {
        evt.preventDefault();
        var wheelDelta = evt.wheelDeltaY;
        if (wheelDelta == undefined) {
            wheelDelta = evt.deltaY * -60;
        }
        zoomCamera(evt.offsetX, evt.offsetY, wheelDelta)
        return false;
    });

    inputTitle.addEventListener("keydown", keyPressTitle);
    inputYear.addEventListener("keydown", keyPressYear);

    setup();


    render();

}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasInfo.height = window.innerHeight;

    cameraCX = canvas.width / 2;
    cameraCY = canvas.height / 2;
    setupSearch();

    render();
}

function setupSearch() {
    var titleWidth = 320;
    var yearWidth = 80;
    var fieldHeight = 24;
    var fieldMargins = 8;
    var fieldPadding = 8;

    inputTitle.style.width = titleWidth + "px";
    inputTitle.style.height = fieldHeight + "px";
    inputTitle.style.left = (canvas.width - (titleWidth + yearWidth + fieldMargins)) / 2 + "px";
    inputTitle.style.top = fieldMargins + "px";
    //(parseInt(document.getElementById("Left").width) + infoPanelWidth) + "px";

    inputYear.style.width = yearWidth + "px";
    inputYear.style.height = fieldHeight + "px";
    inputYear.style.left = (canvas.width - (titleWidth + yearWidth + fieldMargins)) / 2 + titleWidth + fieldMargins + "px";
    inputYear.style.top = fieldMargins + "px";

    inputTitle.style.backgroundColor = colorGreyGlass;
    inputTitle.style.color = colorWhite;
    inputTitle.style.borderWidth = "0px";
    inputYear.style.backgroundColor = colorGreyGlass;
    inputYear.style.color = colorWhite;
    inputYear.style.borderWidth = "0px";

    inputTitle.style.paddingLeft = fieldPadding + "px";
    inputYear.style.paddingLeft = fieldPadding + "px";
    inputTitle.placeholder = "Title";
    inputYear.placeholder = "Year";
}

function setup() {

    // Place home
    var home = new Bubble('Home');
    home.year = -5;
    home.popularity = 100;
    home.tomato = 100;
    home.color = colorLead;
    home.pinToMap();
    bubbles.push(home);


    // Sample Bubbles
    var sample1 = new Bubble('Mission: Impossible Rogue Nation');
    sample1.year = 2015;
    sample1.popularity = 100;
    sample1.plot = "Plot of the movie. This could go on and on, but honestly why bother?";
    sample1.color = colorRed;
    sample1.tomato = 85;
    sample1.pinToMap();
    bubbles.push(sample1);

    var sample2 = new Bubble('Moana');
    sample2.year = 2016;
    sample2.popularity = 80;
    sample2.plot = "Plot of the movie. This could go on and on, but honestly why bother?";
    sample2.color = colorBlue;
    sample2.tomato = 93;
    sample2.pinToMap();
    bubbles.push(sample2);

    var sample3 = new Bubble('Tarzan');
    sample3.year = 2016;
    sample3.popularity = 80;
    sample3.plot = "Plot of the movie. This could go on and on, but honestly why bother?";
    sample3.color = colorYellow;
    sample3.tomato = 93;
    sample3.pinToMap();
    bubbles.push(sample3);

    // Sample links
    var link1 = new Link(home, sample1);
    link1.strength = 0.06;
    links.push(link1);

    var link2 = new Link(home, sample2);
    link2.strength = 0.04;
    links.push(link2);

    var link3 = new Link(home, sample3);
    link3.strength = 0.04;
    links.push(link3);
}

// Debug
function spamBubbles() {
    // Sample Bubbles
    for (var i = 0; i < 100; i++) {
        var sample1 = new Bubble('Movie: the Movie');
        sample1.year = 2000;
        sample1.popularity = Math.random() * 50 + 50;
        sample1.plot = "Plot of the movie. This could go on and on, but honestly why bother?";
        sample1.color = colorYellow;
        sample1.tomato = 85;
        sample1.pinToMap();
        bubbles.push(sample1);

        addLink(sample1);
    }

}