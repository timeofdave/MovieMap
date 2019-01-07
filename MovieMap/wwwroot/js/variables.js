
// DOM objects
var canvas;
var canvasInfo;
var inputTitle;
var inputYear;

// Constants
var sqrt3 = sqrt3 = Math.sqrt(3);
var crowdingFactor = .65;
var lineSpacing = 1.2;
var fullPopularityVotes = 750000;
var infoPanelWidth = 240;

// Objects
var bubbles = [];
var links = [];

// State
var currentBubble = null;
var pinInfo = false;
var opinionMode = false;
var currentUnfilledRing = 0;
var currentPositionInRing = 0;
var canvasInfoWidthExact = 0;
var predragMouseCX = -1;
var predragMouseCY = -1;

// Debug
var renderCount = 1;

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
var colorYellow = "#9E9E50";
var colorCharcoal = "#3f3f3f";
var colorSmoke = "#d8d8d8";
var colorGreyGlass = 'rgba(110, 110, 110, 0.8)';
var colorWhite = "#ffffff";
var colorSilver = "#888888";
var colorLead = "#636363";//"#8f8f8f";
var colorBlack = "#000000";
var colorCoal = "#222222";
var colorBlackGlass = 'rgba(40, 40, 40, 0.7)';