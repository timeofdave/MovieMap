

function infoOpen() {
    var tolerance = 1;
    var slowness = 3;

    canvasInfoWidthExact += (infoPanelWidth - canvasInfoWidthExact) / slowness;
    canvasInfo.width = canvasInfoWidthExact;

    if (Math.abs(infoPanelWidth - canvasInfoWidthExact) <= tolerance) {
        // We have arrived
        canvasInfo.width = infoPanelWidth;
        canvasInfoWidthExact = infoPanelWidth;
        render();
    }
    else {
        setTimeout(render, 15);
    }
}

function renderInfo() {
    //ctxInfo.clearRect(canvasInfo.offsetLeft, 0, canvasInfo.width, canvasInfo.height);

    if (currentBubble !== null) {
        //canvasInfo.width = infoPanelWidth;

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
            ctxInfo.fillText("Filtering Settings", marginLineX, 160);
            ctxInfo.fillText("Maturity Settings", marginLineX, 180);
            ctxInfo.fillText("Account Settings", marginLineX, 200);

        }
        else {
            // This is NOT the home bubble

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

        if (canvasInfo.width != infoPanelWidth) {
            infoOpen();
        }

    }
    else {
        canvasInfoWidthExact = 0;
        canvasInfo.width = 0;
    }
    renderCount++;
    if (renderCount % 20 == 0) {
        console.log("Render " + renderCount);
    }

}
