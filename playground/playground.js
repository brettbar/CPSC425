"use strict";

var canvas;
var gl;

//1)
//Here the squarem file set up maximum numbers for their shapes.
//I assumed it was so only a certain amoun  t of things could be drawn
//      but you'll have to correct me on that
//The biggest one I don't get is index
var maxNumTriangles = 200;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;


//2)
//These variables were from cad2 and they helped me to allow multiple
//      shapes to be drawn WITHOUT an annoying line connecting them.
//I don't understand the logic of how they work so I'll have a comment when
//      we get to the part where they are implemented.
var numLines = 0;
var numShapes = 0;
var numPoints = [];
numPoints[0] = 0;
var start = [0];

var isLine = [];

//redraw was a function from squarem to draw
var redraw = false;

//3)
//brush was a bool for LINE_STRIP / TRIANGLE_FAN
var brush = true;

//the color buttons make "currentColors" equal to an element in "colors"
var currentColor = vec4(0.0, 0.0, 0.0, 1.0);
var colors = [
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0)
];


window.onload = function init() {
    //default stuff
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    //default stuff
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //I understand the logic behind buttons and the HTLM.
    //I have a console.log output to check if they are working when I press them
    ///////////////
    //buttons start (colors)
    ///////////////
    var buttonRed = document.getElementById("colorRed");
    buttonRed.addEventListener("click", function() {
        currentColor = colors[0];
        console.log(currentColor);
    });
    var buttonGreen = document.getElementById("colorGreen");
    buttonGreen.addEventListener("click", function() {
        currentColor = colors[1];
        console.log(currentColor);
    });
    var buttonBlue = document.getElementById("colorBlue");
    buttonBlue.addEventListener("click", function() {
        currentColor = colors[2];
        console.log(currentColor);
    });
    var buttonBlack = document.getElementById("colorBlack");
    buttonBlack.addEventListener("click", function() {
        currentColor = colors[3];
        console.log(currentColor);
    });

    /////////////
    //buttons end (colors)
    /////////////


    //3)
    //buttons to make the brush type boolean T/F
    //I failed to implement these becuase it makes old shapes
    //      change too, not just newly drawn ones
    //I think I failed becuase I'm not using separate loops/functions for the buffers
    //      or that I need new buffers for lines and for filled shapes
    /////////////
    //buttons start (draw shape)
    /////////////
    var buttonLine = document.getElementById("shapeLine");
    buttonLine.addEventListener("click", function() {
        brush = true;
        console.log(brush);
    });
    var buttonFill = document.getElementById("shapeFilled");
    buttonFill.addEventListener("click", function() {
        brush = false;
        console.log(brush);
    });
    /////////////
    //buttons end (draw shape)
    /////////////

    //this is where we get to code from the book
    canvas.addEventListener("mousedown", function(event){
      redraw = true;
    });

    //2)
    //This I need help understanding. cad2 uses variables like these (renamed to make more sense)
    //      and it allows the program to make multiple polygons.
    //I have no idea how these variables work and how their counting works when it comes to
    //      storing info in buffers and using gl.drawArrays, but it works?
    canvas.addEventListener("mouseup", function(event){
      redraw = false;
      numShapes++;
      numPoints[numShapes] = 0;
      start[numShapes] = index;

      isLine.push(brush);
    });

    //I semi-"understand" what is happening here with binding the buffers,
    //      at least, i assumed this is us storing data and the vec2 "t" are the coordinates
    //      of the mouse (that event.clientx formula looks like the one from class where
    //      we have to mess with the screen so webGL's coordinates are the same as the websites).
    //1) + 2)
    //I don't really get how index fits in, and what it has to do with the maximum variables we set at the begining.
    //Same thing with numPoints and numShapes - it allows me to draw more than 1 shape without a connecting line but confused on the logic
    canvas.addEventListener("mousemove", function(event){
        let status = document.getElementById("status");
        status.innerHTML = event.clientX + ", " + event.clientY + " " + event.buttons;

        if(redraw) {
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            var t = vec2(2*event.clientX/canvas.width-1,
            2*(canvas.height-event.clientY)/canvas.height-1);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            t = vec4(currentColor);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
        
            numPoints[numShapes]++;
            index++;        
        }
    } );


    //1)
    //BUFFERSSSSSSSSSSSSSS
    //creating them and binding them makes more sense to me - storing info to be drawn
    //gl.bufferData(target, data, usage) "data" argument sorta makes sense? could use clarification but that's a google thing
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); //vertexAttribPointer(index, size, type, normalized, stride, offset)
                                                                // the last 4 arguments are always "gl.FLOAT, false, 0, 0" for our uses... yes?
                                                                // what is "2" doing for size?
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW ); //more maxNumVertices i don't get
                                                                        //it's related to index, and in a previous loop index incriments, 
                                                                        //but here its not directly connected to index by code

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();

}

//everyone else's render functions are very large and I think i'm doing some stuff in mousedown/up/move that should be in render
//what should i fix?
//also, for getting TRIANGLE_FAN/LINE_STRIP to work i think i need to edit my render function
function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    //2) 
    //this was from cad2, relates to the previous variables that keep showing up
    //pretty much i took the code from cad2 that seemed to allow more than 1 shape (remove the weird connecting line)
    //      and then i placed the equivalent code in different places until it worked (2-3 tries, had to find the right "mouse" action function)
    //      but its not that clear to me
    for(var i=0; i<numShapes; i++) {
        
        gl.drawArrays( isLine[i] ? gl.LINE_STRIP : gl.TRIANGLE_FAN, start[i], numPoints[i] );
        }

    //for(var i=0; i<numLines; i++) {
    //    gl.drawArrays( gl.TRIANGLE_FAN, start[i], numPoints[i] );
    //    }

    window.requestAnimFrame(render);
    
}
