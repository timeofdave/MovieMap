

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

            // The opinion selector
            var sizes = [90, 90, 90, 90];
            var colors = [colorRed, colorPurple, colorBlue, colorGreen];
            var labels = ["Terrible", "Alright", "Great", "Favorite"];
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
            if (b.poster.src != null && b.poster.src != "" && b.poster.naturalWidth > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(b.cx(), b.cy(), b.cSize(), 0, 2 * Math.PI, false);
                ctx.clip();
                var ratio = b.poster.naturalHeight / b.poster.naturalWidth;
                ctx.drawImage(b.poster, b.cx() - b.cSize(), b.cy() - b.cSize() * 0.775 * ratio, b.cSize() * 2, b.cSize() * 2 * ratio);
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
                if (pinInfo == true) {
                    ctx.fillText("Click to rate", b.cx(), b.cy() + b.cSize() * 0.08);
                }
            }

        }
        else {
            // THE DEFAULT LOOK: The circle with Pie shape
            var sizes;
            if (b.tomato == -1 || b.tomato == NaN || b.tomato == "" || b.tomato == null) {
                sizes = [360, 0];
            }
            else if (b.opinion != -1) {
                sizes = [360, 0];
            }
            else {
                sizes = [b.tomato * 3.6, (100 - b.tomato) * 3.6];
            }
            var colors = [b.color, colorLead];
            var labels = null;
            drawPie(ctx, sizes, colors, labels, b.cx(), b.cy(), b.cSize());

            // Title
            var fontSize = b.cSize() / 4;
            if (b.fullTitle().length > 30) {
                fontSize = b.cSize() / (b.fullTitle().length / 7.6);
            }
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


    }
    if (labels != null) {
        drawLabels(labels, cx, cy, cSize);
        //drawSegmentLabel(context, sizes, labels, i);
    }
}

function drawLabels(labels, cx, cy, cSize) {
    var distanceX = cSize / 2.2;
    var distanceY = cSize / 4;
    var fontSize = cSize / 7;
    ctx.font = fontSize + "pt Calibri";

    ctx.fillText(labels[0], cx + distanceX, cy - distanceY);
    ctx.fillText(labels[1], cx + distanceX, cy + distanceY + fontSize);
    ctx.fillText(labels[2], cx - distanceX, cy + distanceY + fontSize);
    ctx.fillText(labels[3], cx - distanceX, cy - distanceY);

}

//unused
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

    // Render copyright
    var fontSize = 10;
    ctx.font = fontSize + "pt Calibri";
    ctx.fillStyle = colorSilver;
    ctx.fillText("Copyright 2019, ZEEP Studios", canvas.width / 2, canvas.height - 10);
}
