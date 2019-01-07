
function onScroll(event) {
    console.log(event.keyCode);
}


function mouseDown(evt) {
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
            // TODO: We don't have bubble dragging yet.
            found = true;
        }
    }

    if (!found) {
        // We are in open space... drag canvas!
        predragMouseCX = xLoc;
        predragMouseCY = yLoc;
    }

    render();
}

function mouseUp(evt) {
    var xLoc = evt.offsetX;
    var yLoc = evt.offsetY;
    var found = false;
    var shouldPin = true;

    predragMouseCX = -1;
    predragMouseCY = -1;

    // Using a for loop so I can exit.
    for (var i = 0; i < bubbles.length && !found; i++) {
        var b = bubbles[i];
        var bubbleCX = b.cx();
        var bubbleCY = b.cy();
        var bubbleCSize = b.cSize();

        if (Math.hypot(bubbleCX - xLoc, bubbleCY - yLoc) < bubbleCSize) {

            if (opinionMode == true) {
                if (xLoc >= bubbleCX && yLoc < bubbleCY) {
                    b.color = colorRed;
                    b.opinion = 25;
                }
                else if (xLoc >= bubbleCX && yLoc >= bubbleCY) {
                    b.color = colorPurple;
                    b.opinion = 50;
                }
                else if (xLoc < bubbleCX && yLoc >= bubbleCY) {
                    b.color = colorBlue;
                    b.opinion = 75;
                }
                else if (xLoc < bubbleCX && yLoc < bubbleCY) {
                    b.color = colorGreen;
                    b.opinion = 100;
                }
                opinionMode = false;
                pinInfo = false;
                shouldPin = false;
            }
            else if (pinInfo == true) {
                opinionMode = true;
            }
            // Make the info panel open or close, etc.
            currentBubble = b;
            found = true;
            if (shouldPin) {
                pinInfo = true;
            }

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

    if (predragMouseCX == -1) {
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
    else {
        // We are in the process of dragging
        cameraMX += toMDistance(predragMouseCX - xLoc);
        cameraMY += toMDistance(predragMouseCY - yLoc);
        predragMouseCX = xLoc;
        predragMouseCY = yLoc;
        render();
    }

}


function rightMouseUp(evt) {
    evt.preventDefault()
    console.log(evt.keyCode);
}

function keyPress(evt) {
    console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 40:
            getMovieDetails(bubbles[1].title, bubbles[1].year); // debug
            break;
        case 32:
            setupSearch(); // debug
            break;
        case 49: // #1
            spamBubbles();
    }
}
function keyPressTitle(evt) {
    console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 13:
            submitSearch();
            break;
    }
}
function keyPressYear(evt) {
    console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 13:
            submitSearch();
            break;
    }
}