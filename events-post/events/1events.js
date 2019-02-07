"use strict";

/** @type{WebGLRenderingContext} */
let gl;

let point;

window.addEventListener("load", function()
{
    let button = document.getElementById("panda");
    button.addEventListener("click", function() {
        console.log("Inline is nifty! :)");
    });
    let canvas = document.getElementById( "gl-canvas" );
    canvas.addEventListener("mousemove", function(event) {
        let status = document.getElementById("status");
        status.innerHTML = event.clientX + ", " + event.clientY + " " + event.buttons;
        if (event.buttons & 1 === 1) {
            // left button held
        }
        if (event.buttons & 2 === 2) {
            // right
        }
        if (event.buttons & 4 === 4) {
            // middle button
        }
        let normalizedX = 2 * event.clientX / canvas.width - 1;
        let normalizedY = 1 - 2 * event.clientY / canvas.height;
        point = vec2(normalizedX, normalizedY);
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(point), gl.DYNAMIC_DRAW );
        render();
    });
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    point = vec2(0,0);

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(point), gl.DYNAMIC_DRAW );

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    

    render();
});


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.POINTS, 0, 1 );
}
