"use strict";

/** @type{WebGLRenderingContext} */
let gl;

let point;

window.addEventListener("load", function()
{
    let canvas = document.getElementById( "gl-canvas" );
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
