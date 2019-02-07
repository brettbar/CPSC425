"use strict";

/** @type{WebGLRenderingContext} */
let gl;

let basePoints;

const NumPoints = 5000;

let bufferId;
let program;
let vPosition;

let angle = 0;

function rotate(angle) {
    return mat2(Math.cos(angle), -Math.sin(angle),
                Math.sin(angle), Math.cos(angle));
}

window.addEventListener("load", function()
{
    let canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    let vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];
    let u = add( vertices[0], vertices[1] );
    let v = add( vertices[0], vertices[2] );
    let p = scale( 0.25, add( u, v ) );

    basePoints = [ p ];

    for ( let i = 0; basePoints.length < NumPoints; ++i ) {
        let j = Math.floor(Math.random() * 3);

        p = add( basePoints[i], vertices[j] );
        p = scale( 0.5, p );

        basePoints.push( p );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    let points =[];
    let mat = rotate(0.3);
    for (let i=0; i<basePoints.length; i++) {
        points[i] = mult(mat, basePoints[i]);
    }
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //render();
    window.requestAnimationFrame(render);
});


function render() {
    angle += 0.02;
    angle = angle % (2*Math.PI);
    let points =[];
    let mat = rotate(angle);
    for (let i=0; i<basePoints.length; i++) {
        points[i] = mult(mat, basePoints[i]);
    }
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.POINTS, 0, basePoints.length );
    window.requestAnimationFrame(render);
}
