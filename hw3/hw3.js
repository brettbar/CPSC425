// Brett Barinaga (10:50 section)
// Andrew Flagstead (1:50 section)
// HW3 
// 10/10/2018
// Note: for the two secondary shapes, rotate them using the first rotation scale and they will appear
// the way they appear by default makes them outside of the canvas view.

"use strict";

let canvas;

/** @type {WebGLRenderingContext} */
let gl;

let program;

let rot1;
let rot2;
let rot3;
let scale1;
let tz;
let tx=0;
let ty=0;

let shapes = [];

let status;

let points = [];
let colors = [];

// chap4 cube.html/cube.js for help with drawing cube to screen 

// Represents a shape to be drawn to the screen, and maintains the relevant
// GPU buffers
class Shape {
    constructor() {
        if (!gl) {
            console.log("Shape constructor must be called after WebGL is initialized");
        }
        // Buffer for vertex positions
        this.vBuffer = gl.createBuffer();

        // Buffer for vertex colors
        this.cBuffer = gl.createBuffer();

        // Transformation matrix
        this.mat = mat4();

        // Number of vertices in this shape
        this.numVertices = 0;

        // What draw mode to use
        this.drawMode = gl.TRIANGLES;
    }

	// use vertex attrib pointer to take data for an attribute to a specific buffer.
    // Render the shape to the screen
    draw() {
        // TODO
        let vPosition = gl.getAttribLocation( program, "vPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        let vColor = gl.getAttribLocation( program, "vColor" );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
      	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
      	gl.enableVertexAttribArray( vColor );

        

        let location = gl.getUniformLocation(program, "mat");
        gl.uniformMatrix4fv(location, false, flatten(this.mat));
        gl.drawArrays( gl.TRIANGLES, 0,  this.numVertices);


    }

    // Set the positions and colors to be used for this shape.  Both positions
    // and colors should be arrays of vec4s.
    setData(positions, colors) {
        if (positions.length != colors.length) {
            console.log("Positions and colors not the same length");
        }
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.DYNAMIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);
        // TODO

        this.numVertices = positions.length;
    }

    // Set transformation matrix
    setMat(mat) {
        this.mat = mat;
    }
}

window.onload = function init()
{
    status = document.getElementById("status");
    rot1 = document.getElementById("rot1");
    rot2 = document.getElementById("rot2");
    rot3 = document.getElementById("rot3");
    scale1 = document.getElementById("scale1");
    tz = document.getElementById("tz");
    [rot1, rot2, rot3, scale1, tz].forEach(function(elem) {
        elem.initValue = elem.value;
        elem.addEventListener("input", render);
        elem.addEventListener("dblclick", function() {
            elem.value = elem.initValue;
            render();
        });
    });
  
    function quad(a,b,c,d, pos, col) {
            let vertices = [
                vec4( -0.5, -0.5,  0.5, 1.0 ),
                vec4( -0.5,  0.5,  0.5, 1.0 ),
                vec4(  0.5,  0.5,  0.5, 1.0 ),
                vec4(  0.5, -0.5,  0.5, 1.0 ),
                vec4( -0.5, -0.5, -0.5, 1.0 ),
                vec4( -0.5,  0.5, -0.5, 1.0 ),
                vec4(  0.5,  0.5, -0.5, 1.0 ),
                vec4(  0.5, -0.5, -0.5, 1.0 )
            ];

            let vertexColors = [
                [ 0.0, 0.0, 0.0, 1.0 ],  // black
                [ 1.0, 0.0, 0.0, 1.0 ],  // red
                [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
                [ 0.0, 1.0, 0.0, 1.0 ],  // green
                [ 0.0, 0.0, 1.0, 1.0 ],  // blue
                [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
                [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
                [ 1.0, 1.0, 1.0, 1.0 ]   // white
            ];

            let indices = [a, b, c, a, c, d];

            for (let i = 0; i < indices.length; i++) {
                pos.push(vertices[indices[i]]);
            }
            for (let i = 0; i < indices.length; i++) {
                col.push(vertexColors[a]);
            }
    }
    /*
    function tri(j,k,l, danny, devito) {
        let vertices = [
            vec4( 0.5, 0.5, 0.5, 1.0 ),
            vec4( -0.5, -0.5, 0.5, 1.0 ),
            vec4( -0.5, 0.5, -0.5, 1.0 ),
            vec4( 0.5, -0.5, -0.5, 1.0 )
        ];

        let vertexColors = [
            [ 0.0, 0.0, 1.0, 1.0 ],  // blue
            [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
            [ 1.0, 0.0, 0.0, 1.0 ],  // red
            [ 1.0, 1.0, 1.0, 1.0 ]   // white
        ];

        let indices = [j, k, l, j];

        for (let i = 0; i < indices.length; i++) {
            danny.push(vertices[indices[i]]);
        }
        for (let i = 0; i < indices.length; i++) {
            devito.push(vertexColors[j]);
        }
    }
    */
    function tri(l, m, n, posn, cols) {
        let vertices = [
            vec4( 0.5, 0.5, 0.5, 1.0 ),
            vec4( -0.5, -0.5, 0.5, 1.0 ),
            vec4( -0.5, 0.5, -0.5, 1.0 ),
            vec4( 0.5, -0.5, -0.5, 1.0 ),

            vec4( 0.5, -0.5, 0.5, 1.0 )
        ];

        let vertexColors = [
            [ 0.0, 0.0, 1.0, 1.0 ],  // blue
            [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
            [ 1.0, 0.0, 0.0, 1.0 ],  // red
            [ 1.0, 1.0, 1.0, 1.0 ]   // white
        ];

        let indices = [l, m, n, l, n, m];

        for (let i = 0; i < indices.length; i++) {
            posn.push(vertices[indices[i]]);
        }
        for (let i = 0; i < indices.length; i++) {
            cols.push(vertexColors[l]);
        }
    }

    let addCube = document.getElementById("addCube");
    let addTet = document.getElementById("addTet");
    let addShapeOne = document.getElementById("addShapeOne");
    let addShapeTwo = document.getElementById("addShapeTwo");

    // TODO: probably set up buttons here
   	addCube.addEventListener("click", function()
    {
    	console.log ("printing a cube");
        let theCube = new Shape();
        let cubePositions = [];
        let cubeColors = [];

        quad( 1, 0, 3, 2, cubePositions, cubeColors );
        quad( 2, 3, 7, 6, cubePositions, cubeColors );
        quad( 3, 0, 4, 7, cubePositions, cubeColors );
        quad( 6, 5, 1, 2, cubePositions, cubeColors );
        quad( 4, 5, 6, 7, cubePositions, cubeColors );
        quad( 5, 4, 0, 1, cubePositions, cubeColors );
	    
	   	theCube.setData(cubePositions, cubeColors);
	    shapes.push(theCube);

        render();
    });
   
    addTet.addEventListener("click", function()
    {
        console.log ("printing a diamond");
        let tetrahedron = new Shape();
        let tetraPositions = [];
        let tetraColors = [];

        tri( 1, 2, 3, tetraPositions, tetraColors);
        tri( 2, 3, 0, tetraPositions, tetraColors);
        tri( 3, 0, 1, tetraPositions, tetraColors);
        tri( 0, 1, 2, tetraPositions, tetraColors);

        tri( 3, 1, 3, tetraPositions, tetraColors);
        tri( 2, 3, 0, tetraPositions, tetraColors);
        tri( 1, 0, 1, tetraPositions, tetraColors);
        tri( 0, 1, 2, tetraPositions, tetraColors);

        tetrahedron.setData(tetraPositions, tetraColors);
        shapes.push(tetrahedron);

        render();
    });

    function xc(u,v) {
        return Math.cos(u*2*Math.PI);
    }
    function yc(u,v) {
        return Math.sin(u*2*Math.PI);
    }
    function zc(u,v) {
        return 2*v;
    }

    addShapeOne.addEventListener("click", function()
    {
    	let theShapeOne = new Shape();
        let s1Positions = [];
        let s1Colors = [];

        const NUM_STEPS = 15;
        for (let u=0; u<NUM_STEPS; u++) {
            for (let v=0; v<NUM_STEPS; v++) {
                let uf = u/NUM_STEPS;
                let vf = v/NUM_STEPS;
                let upf = (u+1)/NUM_STEPS;
                let vpf = (v+1)/NUM_STEPS;
                let currentColor = vec4(1,1,0,1);
                if ((u+v) % 2 === 0) {
                    currentColor = vec4(0,0,0,1);
                }
                s1Positions.push(vec4(xc(uf, vf), yc(uf, vf), zc(uf, vf)));
                s1Positions.push(vec4(xc(upf, vf), yc(upf, vf), zc(upf, vf)));
                s1Positions.push(vec4(xc(upf, vpf), yc(upf, vpf), zc(upf, vpf)));

                s1Positions.push(vec4(xc(uf, vf), yc(uf, vf), zc(uf, vf)));
                s1Positions.push(vec4(xc(upf, vpf), yc(upf, vpf), zc(upf, vpf)));
                s1Positions.push(vec4(xc(uf, vpf), yc(uf, vpf), zc(uf, vpf)));
                
                for (let i=0; i<6; i++) {
                    s1Colors.push(currentColor);
                }
            }
        }

        theShapeOne.setData(s1Positions, s1Colors);
        shapes.push(theShapeOne);

        render();
    });

    addShapeTwo.addEventListener("click", function()
    {
        let theShapeTwo = new Shape();
        let s2Positions = [];
        let s2Colors = [];

        const NUM_STEPS = 5;
        for (let u=0; u<NUM_STEPS; u++) {
            for (let v=0; v<NUM_STEPS; v++) {
                let uf = u/NUM_STEPS;
                let vf = v/NUM_STEPS;
                let upf = (u+1)/NUM_STEPS;
                let vpf = (v+1)/NUM_STEPS;
                let currentColor = vec4(.5,.5,.5,1);
                if ((u+v) % 2 === 0) {
                    currentColor = vec4(0,0,0,1);
                }
                s2Positions.push(vec4(xc(uf, vf), yc(uf, vf), zc(uf, vf)));
                s2Positions.push(vec4(xc(upf, vf), yc(upf, vf), zc(upf, vf)));
                s2Positions.push(vec4(xc(upf, vpf), yc(upf, vpf), zc(upf, vpf)));

                s2Positions.push(vec4(xc(uf, vf), yc(uf, vf), zc(uf, vf)));
                s2Positions.push(vec4(xc(upf, vpf), yc(upf, vpf), zc(upf, vpf)));
                s2Positions.push(vec4(xc(uf, vpf), yc(uf, vpf), zc(uf, vpf)));
                
                for (let i=0; i<6; i++) {
                    s2Colors.push(currentColor);
                }
            }
        }

        theShapeTwo.setData(s2Positions, s2Colors);
        shapes.push(theShapeTwo);

        render();
    });

    let dragging = false;
	// addcube.addeventlistenter, inside of here actually create a new instance of the shape class and set its data to look like a cube 
    canvas = document.getElementById( "gl-canvas" );
    canvas.addEventListener("mousedown", function(event) {
        dragging = true; 
    });
    canvas.addEventListener("mousemove", function() {
        if ((event.buttons & 1 === 1) && dragging) {
            // TODO
            let normalizedX = 2 * event.clientX / canvas.width - 1;
            let normalizedY = 1 - 2 * event.clientY / canvas.height;

            tx = normalizedX;
            ty = normalizedY;

            render();
        }
    });

    canvas.addEventListener("mouseup", function(event) {
        dragging = false;
    });

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    render();
};

function render()
{
    status.innerHTML = "Angles: " + (+rot1.value).toFixed()
        + ", " + (+rot2.value).toFixed()
        + ", " + (+rot3.value).toFixed()
        + ". Scale: " + (+scale1.value).toFixed(2)
        + ". Translation: " + (+tz.value).toFixed(2);
    
    let r1 = rotateX(rot1.value);
    let r2 = rotateY(rot2.value);
    let r3 = rotateZ(rot3.value);
    let s1 = scalem(scale1.value, scale1.value, scale1.value);
    let t1 = translate(tx, ty, tz.value);
    
	// This is where rotate, translate, and scale will need to be handled 
    // TODO: set mat correctly
    let mat = r1;

    mat = mult(r1, mult(r2, r3));
    mat = mult(s1, mat);

    mat = mult(t1, mat);
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (let i=0; i<shapes.length; i++) {
        if (i === shapes.length - 1) {
            shapes[i].setMat(mat);
        }
        shapes[i].draw();
    }
}
