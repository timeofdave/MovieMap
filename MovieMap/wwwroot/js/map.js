﻿// Notes:
// prefix m- means map
// prefix c- means canvas
// The distance from one bubble to another is 2 (in map distance).


// Bubble Object
function Bubble(title) {
    this.movieId = 0;
    this.title = title;
    this.year = 0;
    this.tomato = -1;
    this.popularity = 0;
    this.plot = "";
    this.color = colorBrown;
    this.maturity = null;
    this.poster = new Image();
    this.ring = 0;
    this.position = 0;
    this.mx = 0.0;
    this.my = 0.0;

    this.pinToMap = function () {
        var ringPosition = claimNextRingPosition();
        this.ring = ringPosition[0];
        this.position = ringPosition[1];

        var location = ringPositionToMapLocation(this.ring, this.position);
        this.mx = location[0];
        this.my = location[1];
        
    }
    this.mSize = function () {
        return popularityToMapSize(this.popularity)
    };
    this.fullTitle = function () {
        return (this.title + ' (' + this.year + ')');
    };

    this.cx = function () {
        return toCX(this.mx);
    }
    this.cy = function () {
        return toCY(this.my);
    }
    this.cSize = function () {
        return toCDistance(this.mSize());
    }
}

// Link Object
function Link(bubble1, bubble2) {
    this.bubble1 = bubble1;
    this.bubble2 = bubble2;
    this.color = colorSmoke;
    this.strength = 0.05;
    this.mx = 0.0;
    this.my = 0.0;
    
    this.mSize = function () {
        return popularityToMapSize(this.popularity)
    };

    this.cx = function () {
        return toCX(this.mx);
    }
    this.cy = function () {
        return toCY(this.my);
    }
    this.cSize = function () {
        return toCDistance(this.mSize());
    }
}

var inputTitle;
var inputYear;


// Constants
var sqrt3 = 0.0;
var crowdingFactor = .65;
var lineSpacing = 1.2;
var fullPopularityVotes = 750000;
var homeStuff = "Filtering Settings <\n" + "Maturity Settings <\n" + "Account Settings <\n";

// Objects
var bubbles = [];
var links = [];

// State
var currentBubble = null;
var pinInfo = false;
var opinionMode = false;
var currentUnfilledRing = 0;
var currentPositionInRing = 0;

// Camera
var cameraCX = 0; // the center of the canvas
var cameraCY = 0;

var cameraMX = 0; // the focal point, on the map
var cameraMY = 0;
var cameraZoom = 80; // map to canvas pixels conversion
var cameraZoomSpeed = .15;

// Colors
var colorGreen = "#66a375";
var colorBlue = "#6666aa";
var colorPurple = "#a366a3";
var colorRed = "#a46666";

var colorBrown = "#a39466";
var colorCharcoal = "#3f3f3f";
var colorSmoke = "#d8d8d8";
var colorGreyGlass = 'rgba(110, 110, 110, 0.8)';
var colorWhite = "#ffffff";
var colorSilver = "#888888";
var colorLead = "#636363";//"#8f8f8f";
var colorBlack = "#000000";
var colorCoal = "#222222";
var colorBlackGlass = 'rgba(40, 40, 40, 0.7)';


window.onload = function () {
    canvas = document.getElementById("mapCanvas");
    ctx = canvas.getContext("2d");
    canvasInfo = document.getElementById("infoCanvas");
    ctxInfo = canvas.getContext("2d");
    canvas.tabIndex = 0;

    inputTitle = document.getElementById("inputTitle");
    inputYear = document.getElementById("inputYear");
    document.getElementById("inputYear").style.width = "500px";

    canvas.addEventListener("keydown", keyPress);
    document.addEventListener('click', mouseUp);
    document.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('wheel', function (evt) {
        evt.preventDefault();
        zoomCamera(evt.offsetX, evt.offsetY, evt.wheelDeltaY)
        return false;
    });

    inputTitle.addEventListener("keydown", keyPressTitle);
    inputYear.addEventListener("keydown", keyPressYear);
    /*
    canvas.on('click', function (e) {
        e.preventDefault();

        var mouse = {
            x: e.pageX - canvasPosition.x,
            y: e.pageY - canvasPosition.y
        }

        //do something with mouse position here

        return false;
    });

    // do nothing in the event handler except canceling the event
    canvas.ondragstart = function (e) {
        if (e && e.preventDefault) { e.preventDefault(); }
        if (e && e.stopPropagation) { e.stopPropagation(); }
        return false;
    }

    // do nothing in the event handler except canceling the event
    canvas.onselectstart = function (e) {
        if (e && e.preventDefault) { e.preventDefault(); }
        if (e && e.stopPropagation) { e.stopPropagation(); }
        return false;
    }
    */
    setup();
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
    //(parseInt(document.getElementById("Left").width) + 240) + "px";

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
    sqrt3 = Math.sqrt(3);
    cameraCX = canvas.width / 2;
    cameraCY = canvas.height / 2;


    // Place home
    var home = new Bubble('Home');
    home.year = -5;
    home.popularity = 100;
    home.tomato = 100;
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


    // Sample links
    var link1 = new Link(home, sample1);
    link1.strength = 0.06;
    links.push(link1);

    var link2 = new Link(home, sample2);
    link2.strength = 0.04;
    links.push(link2);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render background
    ctx.fillStyle = colorCharcoal;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    renderLogo();

    // Render links
    links.forEach(l => {
        // The triangle
        ctx.beginPath();
        ctx.fillStyle = l.color;

        var ratio = l.strength;
        var xDistance = l.bubble2.cx() - l.bubble1.cx()
        var yDistance = l.bubble2.cy() - l.bubble1.cy()

        var point0x = l.bubble1.cx() + (yDistance * ratio);
        var point0y = l.bubble1.cy() - (xDistance * ratio);
        var point1x = l.bubble1.cx() - (yDistance * ratio);
        var point1y = l.bubble1.cy() + (xDistance * ratio);
        var point2x = l.bubble2.cx();
        var point2y = l.bubble2.cy();

        ctx.moveTo(point0x, point0y);
        ctx.lineTo(point1x, point1y);
        ctx.lineTo(point2x, point2y);
        ctx.closePath();
        ctx.fill();
    });


    // Render bubbles
    bubbles.forEach(b => {
        
        

        // The circle
        //ctx.beginPath();
        //ctx.fillStyle = b.color;
        //ctx.arc(b.cx(), b.cy(), b.cSize(), 0, 2 * Math.PI, false);
        //ctx.fill();

        if (b === currentBubble && opinionMode) {

            // The circle with Pieness
            var sizes = [90, 90, 90, 90];
            var colors = [colorRed, colorPurple, colorBlue, colorGreen];
            var labels = null;
            drawPie(ctx, sizes, colors, labels, b.cx(), b.cy(), b.cSize());
        }
        else if (b === currentBubble) {
            // The outline if currently selected
            //ctx.beginPath();
            //ctx.lineWidth = 1.5;
            //ctx.strokeStyle = colorSmoke;
            //ctx.arc(b.cx(), b.cy(), b.cSize() + 0.75, 0, 2 * Math.PI, false);
            //ctx.stroke();

            // The circle with image background
            if (b.poster.src != null && b.poster.src != "") {
                ctx.save();
                ctx.beginPath();
                ctx.arc(b.cx(), b.cy(), b.cSize(), 0, 2 * Math.PI, false);
                ctx.clip();
                var ratio = b.poster.naturalHeight / b.poster.naturalWidth;
                ctx.drawImage(b.poster, b.cx() - b.cSize(), b.cy() - b.cSize() * 0.8 * ratio, b.cSize() * 2, b.cSize() * 2 * ratio);
                ctx.fillStyle = colorBlackGlass;
                ctx.arc(b.cx(), b.cy(), b.cSize() * 1.1, 0, 2 * Math.PI, false); // Imprecise size, for tinting.
                ctx.fill();
                ctx.restore();
            }
            else {
                // The circle, no poster available
                ctx.beginPath();
                ctx.fillStyle = colorCoal;
                ctx.arc(b.cx(), b.cy(), b.cSize(), 0, 2 * Math.PI, false);
                ctx.fill();
            }

            if (b.year == -5) {
                // this is the home bubble
            }
            else {
                // Tomato and Maturity
                var fontSize = b.cSize() / 3.5;
                ctx.fillStyle = colorWhite;
                ctx.textAlign = "center";
                ctx.font = fontSize + "px Calibri";
                if (b.tomato != null && b.tomato != -1 && b.tomato != "" && b.tomato != NaN) {
                    ctx.fillText(b.tomato + "%", b.cx(), b.cy() - b.cSize() * 0.6);
                }
                if (b.maturity != null && b.maturity != "") {
                    ctx.fillText(b.maturity, b.cx(), b.cy() + b.cSize() * 0.8);
                }
            }
            
        }
        else {
            // The circle with Pie shape
            var sizes;
            if (b.tomato == -1 || b.tomato == NaN || b.tomato == "" || b.tomato == null) {
                sizes = [360, 0];
            }
            else {
                sizes = [b.tomato * 3.6, (100 - b.tomato) * 3.6];
            }
            var colors = [b.color, colorLead];
            var labels = null;
            drawPie(ctx, sizes, colors, labels, b.cx(), b.cy(), b.cSize());

            // Title
            var fontSize = b.cSize() / 5;
            ctx.fillStyle = colorWhite;
            ctx.textAlign = "center";
            ctx.font = fontSize + "px Calibri";
            if (b.year == -5) {
                ctx.fillText(b.title, b.cx(), b.cy());
            }
            else {
                wrapText(ctx, b.fullTitle(), b.cx(), b.cy(), b.cSize() * 1.8, fontSize * lineSpacing);
            }
        }

        
        
    });
    
    renderInfo();
}

function renderInfo() {
    //ctxInfo.clearRect(canvasInfo.offsetLeft, 0, canvasInfo.width, canvasInfo.height);
    
    if (currentBubble !== null) {
        canvasInfo.width = 240;

        // Render background
        ctx.beginPath();
        ctxInfo.fillStyle = colorGreyGlass;
        ctxInfo.fillRect(canvasInfo.offsetLeft, 0, canvasInfo.width, canvasInfo.height);
        ctxInfo.fill();

        var centerLineX = canvasInfo.offsetLeft + (canvasInfo.width / 2);
        var marginLineX = canvasInfo.offsetLeft + (canvasInfo.width / 20);
        
        var b = currentBubble;

        var fontSize = 20;
        ctxInfo.font = fontSize + "px Calibri";
        ctxInfo.textAlign = "center";

        if (b.year == -5) {
            // This is the home bubble

            // Render nickname
            ctxInfo.fillStyle = "#ffffff";
            ctxInfo.textAlign = "center";
            wrapText(ctxInfo, "MovieNightLover", centerLineX, 60, canvasInfo.width * 0.9, fontSize * lineSpacing);

            // Render email
            fontSize = 16;
            ctxInfo.font = fontSize + "px Calibri";
            ctxInfo.fillStyle = "#ffffff";
            ctxInfo.textAlign = "center";
            wrapText(ctxInfo, "movie@nights.com", centerLineX, 100, canvasInfo.width * 0.9, fontSize * lineSpacing);

            // Render fake stuff
            fontSize = 12;
            ctxInfo.font = fontSize + "px Calibri";
            ctxInfo.textAlign = "left";
            wrapText(ctxInfo, homeStuff, marginLineX, 160, canvasInfo.width * 0.9, fontSize * lineSpacing);
        }
        else {
            var heightUsed = 20;
            var margins = 20;
            // Render Poster
            if (b.poster.src != null && b.poster.src != "") {
                var ratio = b.poster.naturalHeight / b.poster.naturalWidth;
                var posterWidth = canvasInfo.width - margins * 2;
                ctx.drawImage(b.poster, canvasInfo.offsetLeft + margins, heightUsed, posterWidth, posterWidth * ratio);
                heightUsed += posterWidth * ratio + margins;
            }

            // Render title
            ctxInfo.fillStyle = "#ffffff";
            ctxInfo.textAlign = "center";
            var lines = wrapText(ctxInfo, b.fullTitle(), centerLineX, heightUsed + fontSize, canvasInfo.width * 0.9, fontSize * lineSpacing);
            heightUsed += (lines * fontSize * lineSpacing) + margins;

            // Render plot
            fontSize = 12;
            ctxInfo.font = fontSize + "px Calibri";
            ctxInfo.textAlign = "left";
            lines = wrapText(ctxInfo, b.plot, marginLineX, heightUsed + fontSize, canvasInfo.width * 0.9, fontSize * lineSpacing);
            heightUsed += (lines * fontSize * lineSpacing) + margins;
        }
        
    }
    else {
        canvasInfo.width = 0;
    }

}


//-----------------
// Camera functions
//-----------------
function toCX(mx) {
    var mDistance = cameraMX - mx;
    var cDistance = toCDistance(mDistance);
    var cx = cameraCX - cDistance;

    return cx;
}
function toCY(my) {
    var mDistance = cameraMY - my;
    var cDistance = toCDistance(mDistance);
    var cy = cameraCY - cDistance;

    return cy;
}
function toCDistance(mDistance) {
    var cDistance = mDistance * cameraZoom;

    return cDistance;
}

function toMX(cx) {
    var cDistance = cameraCX - cx;
    var mDistance = toMDistance(cDistance);
    var mx = cameraMX - mDistance;

    return mx;
}
function toMY(cy) {
    var cDistance = cameraCY - cy;
    var mDistance = toMDistance(cDistance);
    var my = cameraMY - mDistance;

    return my;
}
function toMDistance(cDistance) {
    var mDistance = cDistance / cameraZoom;

    return mDistance;
}

function zoomCamera(xLoc, yLoc, wheelDeltaY) {
    var originalZoom = cameraZoom;
    var direction = (wheelDeltaY / 180);
    cameraZoom += cameraZoom * cameraZoomSpeed * direction;
    if (cameraZoom < 5) {
        cameraZoom = 5;
    }
    else if (cameraZoom > canvas.height) {
        cameraZoom = canvas.height;
    }

    // Find cursor location on map.
    // Calculate distance to camera point on map.
    // Move camera point towards cursor location.
    // How much? Just enough to offset how much further away
    // the object would be without this correction.
    var zoomRatio = cameraZoom / originalZoom;
    var cxDistance = cameraCX - xLoc;
    var cxDistanceNew = cxDistance * zoomRatio;
    var cxDiscrepancy = cxDistanceNew - cxDistance;
    var mxDiscrepancy = toMDistance(cxDiscrepancy);
    cameraMX -= mxDiscrepancy;

    var cyDistance = cameraCY - yLoc;
    var cyDistanceNew = cyDistance * zoomRatio;
    var cyDiscrepancy = cyDistanceNew - cyDistance;
    var myDiscrepancy = toMDistance(cyDiscrepancy);
    cameraMY -= myDiscrepancy;

    render();
}

// Prints text, but wrapped.
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var numLines = 1;

    for (n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            numLines++;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);

    return numLines;
}





function popularityToMapSize(popularity) {
    return (popularity / 100) * crowdingFactor;
}



// Input

function onScroll(event) {
    console.log(event.keyCode);
}

function mouseUp(evt) {
    var xLoc = evt.offsetX;
    var yLoc = evt.offsetY;
    var found = false;

    // Using a for loop so I can exit.
    for (var i = 0; i < bubbles.length && !found; i++) {
        var b = bubbles[i];
        var bubbleCX = b.cx();
        var bubbleCY = b.cy();
        var bubbleCSize = b.cSize();
        
        if (Math.hypot(bubbleCX - xLoc, bubbleCY - yLoc) < bubbleCSize) {

            if (pinInfo == true) {
                opinionMode = true;
            }
            // Make the info panel open or close, etc.
            currentBubble = b;
            found = true;
            pinInfo = true;
            
        }
    }

    if (!found && evt.target !== canvasInfo) {
        pinInfo = false;
        currentBubble = null;
        opinionMode = false;
    }
    
    render();
}

function mouseMove(evt) {
    var xLoc = evt.offsetX;
    var yLoc = evt.offsetY;
    var found = false;
    var originalCurrentBubble = currentBubble;

    // Using a for loop so I can exit.
    for (var i = 0; i < bubbles.length && !found; i++) {
        var b = bubbles[i];
        var bubbleCX = b.cx();
        var bubbleCY = b.cy();
        var bubbleCSize = b.cSize();
        
        // Make the info panel open or close, etc.
        if (Math.hypot(bubbleCX - xLoc, bubbleCY - yLoc) < bubbleCSize) {
            found = true;

            if (!pinInfo) {
                currentBubble = b;
            }
            if (!opinionMode) {
                
            }
        }
    }

    if (!found && !pinInfo && evt.target !== canvasInfo) {
        currentBubble = null;
    }

    if (currentBubble !== originalCurrentBubble) {
        render();
    }

    
}

function rightMouseUp(evt) {
    evt.preventDefault()
    console.log(evt.keyCode);
}

function keyPress(evt) {
    console.log(event.keyCode);
    switch (evt.keyCode) {
        case 40:
            getMovieDetails(bubbles[1].title, bubbles[1].year); // debug
            break;
        case 32:
            setupSearch(); // debug
            break;
    }
}
function keyPressTitle(evt) {
    console.log(event.keyCode);
    switch (evt.keyCode) {
        case 13:
            submitSearch();
            break;
    }
}
function keyPressYear(evt) {
    console.log(event.keyCode);
    switch (evt.keyCode) {
        case 13:
            submitSearch();
            break;
    }
}

// Unused
function setCurrentBubble(b) {
    currentBubble = b;
}

function submitSearch() {
    if (inputTitle.value == null || inputTitle.value == "") {
        // focus inputTitle
    }
    getMovieDetails(inputTitle.value, inputYear.value);
    inputTitle.blur();
    inputYear.blur();
    canvas.focus();
}

function searchReturned(movie) {
    console.log(movie);

    if (movie.title == null) {
        inputTitle.focus();
    }
    else {
        inputTitle.value = "";
        inputYear.value = "";

        var b = addBubble(movie);

        //currentBubble = b;
        //pinInfo = true;

        render();
    }
    
}

function addBubble(movie) {
    var b = new Bubble(movie.title);
    b.year = movie.year;
    b.popularity = votesToPopularity(movie.imdbVotes);
    b.plot = movie.plot;
    b.color = colorRed;
    b.poster.src = movie.poster;
    b.maturity = movie.rated;
    var tomatoIndex = movie.ratings.findIndex(item => item.source === 'Rotten Tomatoes');
    if (tomatoIndex != -1) {
        b.tomato = (movie.ratings[tomatoIndex].value).replace(/\D+/g, '');
    }
    b.pinToMap();
    bubbles.push(b);

    addLink(b);

    cameraPan(b);

    return b;
}

function addLink(bubble) {
    var ancestor = null;

    // Using a for loop so I can exit.
    for (var i = 0; i < bubbles.length && ancestor == null; i++) {
        var b = bubbles[i];

        if (b.ring == bubble.ring - 1) {
            if (b.ring == 0) {
                ancestor = b;
            }
            if (Math.round((bubble.position / bubble.ring) * b.ring) == b.position) {
                ancestor = b;
            }
            if (bubble.position == 11 && b.position == 0 && b.ring == 1) {
                ancestor = b;
            }
        }
    }

    if (ancestor != null) {
        var link = new Link(ancestor, bubble);
        link.strength = 0.05;
        links.push(link);
    }
}

function votesToPopularity(votesRaw) {
    var votesNum = 0;
    if (votesRaw != null) {
        votesNum = votesRaw.replace(/\D+/g, '');
    }

    var popularity = 50 + 50 * (votesNum / fullPopularityVotes);
    popularity = Math.min(popularity, 100)

    return popularity;
}

function cameraPan(bubble) {
    cameraDesiredMX = bubble.mx;
    cameraDesiredMY = bubble.my;

    cameraPanStep();
}

function cameraPanStep() {
    var tolerance = 0.01;
    var slowness = 6;

    cameraMX -= (cameraMX - cameraDesiredMX) / slowness;
    cameraMY -= (cameraMY - cameraDesiredMY) / slowness;

    if (Math.abs(cameraMX - cameraDesiredMX) < tolerance &&
        Math.abs(cameraMY - cameraDesiredMY) < tolerance) {
        // We have arrived
    }
    else {
        setTimeout(cameraPanStep, 15);
        console.log("Step");
    }
    render();
}


//var data = [20, 10, 330];
//var labels = ["120", "100", "140"];
//var colors = ["#FFDAB9", "#E6E6FA", "#E0FFFF"];

function drawPie(context, sizes, colors, labels, cx, cy, cSize) {

    for (var i = 0; i < sizes.length; i++) {
        context.save();
        var centerX = cx;
        var centerY = cy;
        radius = cSize;

        var startingAngle = degreesToRadians(sumTo(sizes, i) - 90);
        var arcSize = degreesToRadians(sizes[i]);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = colors[i];
        context.fill();

        context.restore();

        if (labels != null) {
            //drawSegmentLabel(context, sizes, labels, i);
        }
    }
}

function drawSegmentLabel(context, sizes, labels, i) {
    context.save();
    var x = Math.floor(canvas.width / 2);
    var y = Math.floor(canvas.height / 2);
    var angle = degreesToRadians(sumTo(sizes, i));

    context.translate(x, y);
    context.rotate(angle);
    var dx = Math.floor(canvas.width * 0.5) - 10;
    var dy = Math.floor(canvas.height * 0.05);

    context.textAlign = "right";
    var fontSize = Math.floor(canvas.height / 25);
    context.font = fontSize + "pt Helvetica";

    context.fillText(labels[i], dx, dy);

    context.restore();
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function sumTo(a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j];
    }
    return sum;
}

function renderLogo() {
    ctx.fillStyle = "#ed7d31"
    ctx.textAlign = "center";
    ctx.font = "30px Cooper Black";
    ctx.fillText("Movie", 60, 30);
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center";
    ctx.font = "30px Cooper Black";
    ctx.fillText("Map", 137, 30);
}

function claimNextRingPosition() {
    var ring = currentUnfilledRing;
    var position = currentPositionInRing++;

    if (currentPositionInRing >= currentUnfilledRing * 6) {
        currentUnfilledRing += 1;
        currentPositionInRing = 0;
    }

    return [ring, position];
}

function ringPositionToMapLocation(ring, position) {
    var direction = Math.floor(position / ring);
    var xLoc = 0;
    var yLoc = 0;

    if (direction % 3 == 0) {
        xLoc = 0;
        yLoc = -2 * ring;

        var positionOffset = position - (ring * direction);
        xLoc += sqrt3 * positionOffset;
        yLoc += positionOffset;
    }
    else if (direction % 3 == 1) {
        xLoc = sqrt3 * ring;
        yLoc = -1 * ring;

        var positionOffset = position - (ring * direction);
        xLoc += 0;
        yLoc += 2 * positionOffset;
    }
    else if (direction % 3 == 2) {
        xLoc = sqrt3 * ring;
        yLoc = 1 * ring;

        var positionOffset = position - (ring * direction);
        xLoc -= sqrt3 * positionOffset;
        yLoc += 1 * positionOffset;
    }

    if (direction > 2) {
        xLoc *= -1;
        yLoc *= -1;
    }

    return [xLoc, yLoc];
}

function getMovieDetails(title, stringYear) {
    var year = parseInt(stringYear);

    if (year == null || year == NaN || year == "" || year > 9999 || year <= 999) {
        year = 0;
    }
    var queryString = "&title=" + title + "&year=" + year;
    
    $.ajax({
        type: "GET",
        url: "/About?handler=FetchMovie" + queryString,
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            searchReturned(response);
        },
        failure: function (response) {
            console.log(response);
        }
    });
}
