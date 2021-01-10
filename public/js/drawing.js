// var socket = io();

// JavaScript Paint

// Reference to the canvas element
let canvas;
// Context provides functions used for drawing and 
// working with Canvas
let ctx;
// Stores previously drawn image data to restore after
// new drawings are added
let savedImageData;
let oldSavedImageData;
// Stores whether I'm currently dragging the mouse
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let lineWidth = 2;
// Tool currently using
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

// Stores whether I'm currently using brush
let usingBrush = false;
// Stores line x & ys used to make brush lines
let brushXPoints = new Array();
let brushYPoints = new Array();
// Stores whether mouse is down
let brushDownPos = new Array();

let brush = document.getElementById("brush");
let line = document.getElementById("line");
let rectangle = document.getElementById("rectangle");
let circle = document.getElementById("circle");

let black = document.getElementById("black");
let gray = document.getElementById("gray");
let white = document.getElementById("white");
let brown = document.getElementById("brown");
let red = document.getElementById("red");
let orange = document.getElementById("orange");
let yellow = document.getElementById("yellow");
let lime = document.getElementById("lime");
let green = document.getElementById("green");
let blue = document.getElementById("blue");
let cyan = document.getElementById("cyan");
let magenta = document.getElementById("magenta");
let purple = document.getElementById("purple");

let imageData;
let imageNumber = 1;

function SendCanvasDataToServer() {
    imageData = canvas.toDataURL();
    // socket.emit('drawing', imageData);
    if (imageNumber == 1) {
        document.getElementById("instructions").innerText = "Your first design was saved. Draw your second design now!";
        imageNumber++;
        ResetCanvas();
    } else if (imageNumber == 2) {
        window.location.href = "./slogans.html";
    }
}

// Stores size data used to create rubber band shapes
// that will redraw as the user moves the mouse
class ShapeBoundingBox {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

// Holds x & y position where clicked
class MouseDownPos {
    constructor(x, y) {
        this.x = x,
            this.y = y;
    }
}

// Holds x & y location of the mouse
class Location {
    constructor(x, y) {
        this.x = x,
            this.y = y;
    }
}

// Stores top left x & y and size of rubber band box 
let shapeBoundingBox = new ShapeBoundingBox(0, 0, 0, 0);
// Holds x & y position where clicked
let mousedown = new MouseDownPos(0, 0);
// Holds x & y location of the mouse
let loc = new Location(0, 0);

// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
    // Get reference to canvas element
    canvas = document.getElementById('my-canvas');
    // Get methods for manipulating the canvas
    ctx = canvas.getContext('2d');
    // Execute ReactToMouseDown when the mouse is clicked
    canvas.addEventListener("mousedown", ReactToMouseDown);
    // Execute ReactToMouseMove when the mouse is clicked
    canvas.addEventListener("mousemove", ReactToMouseMove);
    // Execute ReactToMouseUp when the mouse is clicked
    canvas.addEventListener("mouseup", ReactToMouseUp);
}

function ChangeTool(toolClicked) {
    brush.classList.remove("toolSelected");
    line.classList.remove("toolSelected");
    rectangle.classList.remove("toolSelected");
    circle.classList.remove("toolSelected");
    // Highlight the last selected tool on toolbar
    document.getElementById(toolClicked).classList.add("toolSelected");
    // Change current tool used for drawing
    currentTool = toolClicked;
}

function ChangeColor(color) {
    black.classList.remove("colorSelected");
    gray.classList.remove("colorSelected");
    white.classList.remove("colorSelected");
    brown.classList.remove("colorSelected");
    red.classList.remove("colorSelected");
    orange.classList.remove("colorSelected");
    yellow.classList.remove("colorSelected");
    lime.classList.remove("colorSelected");
    green.classList.remove("colorSelected");
    blue.classList.remove("colorSelected");
    cyan.classList.remove("colorSelected");
    magenta.classList.remove("colorSelected");
    purple.classList.remove("colorSelected");
    // Highlight the last selected tool on toolbar
    document.getElementById(color).classList.add("colorSelected");
    // Change current color used for drawing
    strokeColor = color;
    fillColor = color;
}

// Returns mouse x & y position based on canvas position in page
function GetMousePosition(x, y) {
    // Get canvas size and position in web page
    let canvasSizeData = canvas.getBoundingClientRect();
    return {
        x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height)
    };
}

function SaveCanvasImage() {
    // Save image
    oldSavedImageData = savedImageData;
    savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function RedrawCanvasImage() {
    // Restore image
    ctx.putImageData(savedImageData, 0, 0);
}

function UpdateRubberbandSizeData(loc) {
    // Height & width are the difference between were clicked
    // and current mouse position
    shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

    // If mouse is below where mouse was clicked originally
    if (loc.x > mousedown.x) {

        // Store mousedown because it is farthest left
        shapeBoundingBox.left = mousedown.x;
    } else {

        // Store mouse location because it is most left
        shapeBoundingBox.left = loc.x;
    }

    // If mouse location is below where clicked originally
    if (loc.y > mousedown.y) {

        // Store mousedown because it is closer to the top
        // of the canvas
        shapeBoundingBox.top = mousedown.y;
    } else {

        // Otherwise store mouse position
        shapeBoundingBox.top = loc.y;
    }
}

// Returns the angle using x and y
// x = Adjacent Side
// y = Opposite Side
// Tan(Angle) = Opposite / Adjacent
// Angle = ArcTan(Opposite / Adjacent)
function getAngleUsingXAndY(mouselocX, mouselocY) {
    let adjacent = mousedown.x - mouselocX;
    let opposite = mousedown.y - mouselocY;

    return radiansToDegrees(Math.atan2(opposite, adjacent));
}

function radiansToDegrees(rad) {
    if (rad < 0) {
        // Correct the bottom error by adding the negative
        // angle to 360 to get the correct result around
        // the whole circle
        return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
    } else {
        return (rad * (180 / Math.PI)).toFixed(2);
    }
}

// Converts degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Called to draw the line
function drawRubberbandShape(loc) {
    if (currentTool === "brush") {
        // Create paint brush
        DrawBrush();
    } else if (currentTool === "line") {
        // Draw Line
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(mousedown.x, mousedown.y);
        ctx.lineTo(loc.x, loc.y);
        ctx.stroke();
    } else if (currentTool === "rectangle") {
        // Creates rectangles
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if (currentTool === "circle") {
        // Create circles
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = lineWidth;
        let radius = shapeBoundingBox.width;
        ctx.beginPath();
        ctx.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function UpdateRubberbandOnMove(loc) {
    // Stores changing height, width, x & y position of most 
    // top left point being either the click or mouse location
    UpdateRubberbandSizeData(loc);

    // Redraw the shape
    drawRubberbandShape(loc);
}

// Store each point as the mouse moves and whether the mouse
// button is currently being dragged
function AddBrushPoint(x, y, mouseDown) {
    brushXPoints.push(x);
    brushYPoints.push(y);
    // Store true that mouse is down
    brushDownPos.push(mouseDown);
}

// Cycle through all brush points and connect them with lines
function DrawBrush() {
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let i = 1; i < brushXPoints.length; i++) {
        // Check if the mouse button was down at this point
        // and if so continue drawing
        if (brushDownPos[i]) {
            ctx.moveTo(brushXPoints[i - 1], brushYPoints[i - 1]);
        } else {
            ctx.moveTo(brushXPoints[i] - 1, brushYPoints[i]);
        }
        ctx.lineTo(brushXPoints[i], brushYPoints[i]);
        ctx.stroke();
    }
    ctx.closePath();
}

function ChangeLineWidth(size) {
    lineWidth = size;
}

function ReactToMouseDown(e) {
    // Change the mouse pointer to a crosshair
    canvas.style.cursor = "crosshair";
    // Store location 
    loc = GetMousePosition(e.clientX, e.clientY);
    // Save the current canvas image
    SaveCanvasImage();
    // Store mouse position when clicked
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    // Store that yes the mouse is being held down
    dragging = true;

    // Brush will store points in an array
    if (currentTool === 'brush') {
        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);
    }
};

function ReactToMouseMove(e) {
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    // If using brush tool and dragging store each point
    if (currentTool === 'brush' && dragging && usingBrush) {
        // Throw away brush drawings that occur outside of the canvas
        if (loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight) {
            AddBrushPoint(loc.x, loc.y, true);
        }
        RedrawCanvasImage();
        DrawBrush();
    } else if (dragging) {
        RedrawCanvasImage();
        UpdateRubberbandOnMove(loc);
    }
};

function ReactToMouseUp(e) {
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
    brushXPoints = [];
    brushYPoints = [];
        // Save the current canvas image
        SaveCanvasImage();
}


// Saves the image in your default download directory
function SaveImage() {
    // Get a reference to the link element 
    var imageFile = document.getElementById("img-file");
    // Set that you want to download the image when link is clicked
    imageFile.setAttribute('download', 'tshirt.png');
    // Reference the image in canvas for download
    imageFile.setAttribute('href', canvas.toDataURL());
}

function FillCanvas() {
    document.getElementById("my-canvas").style.backgroundColor = fillColor;
}

function ResetCanvas() {
    SaveCanvasImage();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("my-canvas").style.backgroundColor = "white";
}

function Undo() {
    ctx.putImageData(oldSavedImageData, 0, 0);
}