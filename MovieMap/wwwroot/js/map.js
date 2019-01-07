// Notes:
// prefix m- means map
// prefix c- means canvas
// The distance from one bubble to another is 2 (in map distance).


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


// Unused
function setCurrentBubble(b) {
    currentBubble = b;
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
