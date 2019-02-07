"use strict";

let canvas;

/** @type {WebGLRenderingContext} */
let gl;

let points = [];
let colors = [];

let NumTimesToSubdivide = 3;

let program;

let rot1;
let rot2;
let rot3;
let scale1;
let t1;
let t2;

let status;


window.onload = function init()
{
    status = document.getElementById("status");
    rot1 = document.getElementById("rot1");
    rot2 = document.getElementById("rot2");
    rot3 = document.getElementById("rot3");
    scale1 = document.getElementById("scale1");
    t1 = document.getElementById("t1");
    t2 = document.getElementById("t2");
    [rot1, rot2, rot3, scale1, t1, t2].forEach(function(elem) {
        elem.initValue = elem.value;
        elem.addEventListener("input", render);
        elem.addEventListener("dblclick", function() {
            elem.value = elem.initValue;
            render();
        });
    });
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket
    // Four vertices on unit circle
    // Intial tetrahedron with equal length sides

    let vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  0.9428,  0.3333 ),
        vec3( -0.8165, -0.4714,  0.3333 ),
        vec3(  0.8165, -0.4714,  0.3333 )
    ];

    divideTetra( vertices[0], vertices[1], vertices[2], vertices[3],
                 NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    // enable hidden-surface removal

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c, color )
{

    // add colors and vertices for one triangle

    let baseColors = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 0.7, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 0.0)
    ];

    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );
}

function tetra( a, b, c, d )
{
    // tetrahedron with each side using
    // a different color

    triangle( a, c, b, 0 );
    triangle( a, c, d, 1 );
    triangle( a, b, d, 2 );
    triangle( b, c, d, 3 );
}

function divideTetra( a, b, c, d, count )
{
    // check for end of recursion

    if ( count === 0 ) {
        tetra( a, b, c, d );
    }

    // find midpoints of sides
    // divide four smaller tetrahedra

    else {
        let ab = mix( a, b, 0.5 );
        let ac = mix( a, c, 0.5 );
        let ad = mix( a, d, 0.5 );
        let bc = mix( b, c, 0.5 );
        let bd = mix( b, d, 0.5 );
        let cd = mix( c, d, 0.5 );

        --count;

        divideTetra(  a, ab, ac, ad, count );
        divideTetra( ab,  b, bc, bd, count );
        divideTetra( ac, bc,  c, cd, count );
        divideTetra( ad, bd, cd,  d, count );
    }
}


function render()
{
    status.innerHTML = "Angles: " + (+rot1.value).toFixed()
        + ", " + (+rot2.value).toFixed()
        + ", " + (+rot3.value).toFixed()
        + ". Scale: " + (+scale1.value).toFixed(2)
        + ". Translation: " + (+t1.value).toFixed(2)
        + ", " + (+t2.value).toFixed(2);
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let r1 = rotateX(rot1.value);
    let r2 = rotateY(rot2.value);
    let r3 = rotateZ(rot3.value);
    let s1 = scalem(scale1.value, scale1.value, scale1.value);
    let trans = translate(t1.value, t2.value, 0);

    let bigKahuna = mult(trans, r1);

    let location = gl.getUniformLocation(program, "mat");
    gl.uniformMatrix4fv(location, false, flatten(bigKahuna));
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}