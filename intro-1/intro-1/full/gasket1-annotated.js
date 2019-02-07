"use strict";
// Use strict tells the js interpreter to actually care if we do bad things.
// You should almost always use this since it helps catch errors.

// This variable will be used to represent the WebGL context, meaning it will
// provide us access to the various WebGL functions
var gl;

// Stores the points to be drawn to the screen
var points;

// How many points to generate
const NumPoints = 5000;

// Tells the window that when the document is finished loading, run the function
// given here.
window.addEventListener("load", function()
{
    // Find the canvas element that has the id "gl-canvas".  There is nothing
    // special about this string; it's just the one we used in the HTML file.
    var canvas = document.getElementById( "gl-canvas" );

    // Call a function in Common/webgl-utils.js to get our WebGL context
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // Note that, in order to add, multiply, or do any math with vectors,
    // we need to call functions instead of using operators.  Blame js for
    // not supporting operator overloading.

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 0; points.length < NumPoints; ++i ) {
        // Set j to be either 0, 1, or 2 (randomly)
        var j = Math.floor(Math.random() * 3);

        // Compute p = 0.5 * (points[i] + vertices[j])
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );

        // And add p to the end of the "points" array
        points.push( p );
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );

    // Set the background color to be opaque white
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

    // Tell WebGL that, until told otherwise, things drawn to the screen should
    // use the code in the specified shader program.
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
});


function render() {
    // Clear the screen (set the color everywhere to be what we set the
    // clear color to)
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw the data we've uploaded to the graphics card
    gl.drawArrays( gl.POINTS, 0, points.length );
}
