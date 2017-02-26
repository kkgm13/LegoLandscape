var WIDTH = 699;
var HEIGHT = 500;

const BRICK_WIDTH = 4;
const BRICK_HEIGHT = 2;
const BRICK_DEPTH = 4;

const MAX_HEIGHT = 600; //600 will be good

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1);
scene.add(light);

light = new THREE.DirectionalLight(0x002288);
light.position.set(-1, -1, -1);
scene.add(light);

light = new THREE.AmbientLight(0x222222);
scene.add(light);

var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

camera.position.z = 50;

var generateColour = function (height) {
    var colourInt = (16777214 * height) / MAX_HEIGHT;
    return colourInt.toString(16);
}

var drawLegoLandscape = function (map, size) {

    var ii = 0;
    var jj = 0;

    var heightmap = map;
    var s = size;

    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            //var geometry = new THREE.BoxGeometry( BRICK_WIDTH, heightmap[i][j], BRICK_DEPTH)

            var loader = new THREE.JSONLoader();
            loader.load('graphics/brick.json', function (geometry) {

                var height = heightmap[jj*s + ii];

                var number =  height - Math.min();

                var material = new THREE.MeshLambertMaterial({
                    color: parseInt(generateColour(height), 16),
                    shading: THREE.FlatShading
                });

                var cube = new THREE.Mesh(geometry, material);

                cube.position.x = ii * BRICK_WIDTH;
                cube.position.y = Math.floor(height)*2.0;
                cube.position.z = jj * BRICK_DEPTH;
                cube.updateMatrix();
                cube.matrixAutoUpdate = false;

                scene.add(cube);

                ii = ii+1;

                if(ii == s)
                {
                    ii = 0;
                    jj = jj+1;
                }

            });
        }
    }
};

var getHeightData = function(img) {

    var canvas = document.createElement( 'canvas' );
    var sq = img.width
    canvas.width = sq;
    canvas.height = sq;
    var context = canvas.getContext( '2d' );

    var size = sq * sq, data = [];

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, sq, sq);
    var pix = imgd.data;

    var j=0;
    for (var i = 0; i < pix.length; i += (4)) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/30;
    }

    return data;
}

var getColours = function(img) {

    var canvas = document.createElement( 'canvas' );
    var sq = img.width
    canvas.width = sq;
    canvas.height = sq;
    var context = canvas.getContext( '2d' );

    var size = sq * sq, data = [];

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, sq, sq);
    var pix = imgd.data;

    var j=0;
    for (var i = 0; i < pix.length; i += (4)) {
        var all = [pix[i],pix[i+1],pix[i+2]];
        data[j++] = all;
    }

    return data;
}


var loader = new THREE.ImageLoader();
var imgPath = 'E_5_256.png';

loader.load(
    // resource URL
    imgPath,
    // Function when resource is loaded
    function ( image ) {
        drawLegoLandscape(getHeightData(image), image.width);
    },
    // Function called when download progresses
    function ( xhr ) {

    },
    // Function called when download errors
    function ( xhr ) {

    }
);

var render = function () {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

render();

