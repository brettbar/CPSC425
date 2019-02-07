// Brett Barinaga
// 10/2/2018
// CPSC 425
// HW2

"use strict";

/** @type{WebGLRenderingContext} */
let gl;

// You will want to add additional variables to keep track of what needs
// to be drawn

let currentColor = vec4(0,0,0,1);
let drawingLines = true;

let linePositions = [];
let lineColors = [];
let lineLengths = [];
let filledPositions = [];
let filledColors = [];
let filledLengths = [];

let currentPositions = [];
let currentColors = [];

let vBuffer;
let cBuffer;

let program;

// based off of the cad2 example from the github.
let shapes = 0;
let points = [];
points[0] = 0;
let startTracker = [0];
let tracker = 0;

window.addEventListener("load", function()
{
    let greenButton = document.getElementById("colorGreen");
    let redButton = document.getElementById("colorRed");
    let blueButton = document.getElementById("colorBlue");
    let blackButton = document.getElementById("colorBlack");

    let lineButton = document.getElementById("shapeLine");
    let filledButton = document.getElementById("shapeFilled");
    let canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );

    greenButton.addEventListener("click", function() {
      currentColor = vec4(0,1,0,1);
    });
    redButton.addEventListener("click", function() {
      currentColor = vec4(1,0,0,1);
    });
    blueButton.addEventListener("click", function() {
      currentColor = vec4(0,0,1,1);
    });
    blackButton.addEventListener("click", function() {
      currentColor = vec4(0,0,0,1);
    });
    lineButton.addEventListener("click", function() {
    	drawingLines = true;
        console.log(drawingLines);
    });
    filledButton.addEventListener("click", function() {
    	drawingLines = false;
        console.log(drawingLines);
    });

    canvas.addEventListener("mousedown", function(event) {
    });

    canvas.addEventListener("mousemove", function(event) {
    	if (event.buttons & 1 === 1) { 
            let normalizedX = 2 * event.clientX / canvas.width - 1;
            let normalizedY = 1 - 2 * event.clientY / canvas.height;

			let point = vec2(normalizedX, normalizedY);
            currentPositions.push(point);
            currentColors.push(currentColor);

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(currentPositions), gl.DYNAMIC_DRAW );
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(currentColors), gl.DYNAMIC_DRAW );

            points[shapes]++;
            tracker++;
        }      

        let status = document.getElementById("status");
        status.innerHTML = event.clientX + ", " + event.clientY + " " + event.buttons;

        render();

    });
    canvas.addEventListener("mouseup", function() {
    	shapes++;
    	points[shapes] = 0;
    	startTracker[shapes] = tracker;

        if (drawingLines) {
            linePositions.push(vBuffer);
            lineLengths.push(currentPositions.length);
            lineColors.push(cBuffer);

        } else {
            filledPositions.push(vBuffer);
            filledLengths.push(currentPositions.length);
            filledColors.push(cBuffer); 
        }
    });
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

// make position buffer
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(currentPositions), gl.DYNAMIC_DRAW );

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

// create color buffer
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(currentColors), gl.DYNAMIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
});


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (drawingLines)
    	for (let i = 0; i < shapes; i++) {
    		gl.drawArrays(gl.LINE_STRIP, startTracker[i], points[i]);
    	}
    else 
    	for (let i = 0; i < shapes; i++) {
    		gl.drawArrays(gl.TRIANGLE_FAN, startTracker[i], points[i]);
    	}
}
