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
