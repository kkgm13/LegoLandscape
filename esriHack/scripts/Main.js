var gl; // A global variable for the WebGL context

const BRICK_WIDTH = 2;
const BRICK_HEIGHT = 2;
const BRICK_DEPTH

function start()
{
    var canvas = document.getElementById('glCanvas');

    // Initialize the GL context
    gl = initWebGL(canvas);

    // Only continue if WebGL is available and working
    if (!gl)
    {
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initWebGL(canvas)
{
    gl = null;

    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now
    if (!gl)
    {
        alert('Unable to initialize WebGL. Your browser may not support it.');
    }

    return gl;
}

function drawCuboid(x, z, h)
{
    //VERTICIES

    var x1 = x*BRICK_WIDTH;
    var z1 = z*BRICK_DEPTH;

    var vertices = [
        //BOTTOM
        x1, 0, z1,
        x1+BRICK_WIDTH, 0, z1,
        x1+BRICK_WIDTH, 0, z1+BRICK_DEPTH,
        x1, 0, z1+BRICK_DEPTH,

        //FRONT
        x1, 0, z1,
        x1+BRICK_WIDTH, 0, z1,
        x1+BRICK_WIDTH, h, z1,
        x1, h, z1,

        //LEFT
        x1+BRICK_WIDTH, 0, z1,
        x1+BRICK_WIDTH, 0, z1+BRICK_DEPTH,
        x1+BRICK_WIDTH, h, z1+BRICK_DEPTH,
        x1+BRICK_WIDTH, h, z1,

        //BACK
        x1+BRICK_WIDTH, 0, z1+BRICK_DEPTH,
        x1, 0, z1+BRICK_DEPTH,
        x1, h, z1+BRICK_DEPTH,
        x1+BRICK_WIDTH, h, z1+BRICK_DEPTH,

        //RIGHT
        x1, 0, z1,
        x1, 0, z1+BRICK_DEPTH,
        x1, h, z1+BRICK_DEPTH,
        x1, h, z1,

        //TOP
        x1, h, z1,
        x1+BRICK_WIDTH, h, z1,
        x1+BRICK_WIDTH, h, z1+BRICK_DEPTH,
        x1, h, z1+BRICK_DEPTH,
    ];

    //COLOURS

    var colours = [];

    for(var i = 0; i < 96; i++)
    {
        colours.append(1.0);
    }

    var cubeVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

    //ELEMENTS

    var cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer)

    var cubeVertexIndices = [
        0,  1,  3,      1,  2,  3,    // bottom
        5,  7,  6,      5,  4,  7,    // front
        8,  9,  11,     8,  10, 9,   // left
        12, 15, 14,     13, 12, 14,   // back
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // top
    ];
}

function drawLegoMap(heightmap)
{

}

