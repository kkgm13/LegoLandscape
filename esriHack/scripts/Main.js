var WIDTH = 699;
var HEIGHT = 500;

const BRICK_WIDTH = 4;
const BRICK_HEIGHT = 2;
const BRICK_DEPTH = 4;

const MAX_HEIGHT = 30; //600 will be good

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

camera.position.z = 5;

var generateColour = function (height) {
    var colourInt = (268435455 * height) / MAX_HEIGHT;
    return colourInt.toString(16);
}

var drawLegoLandscape = function (heightmap, size) {

    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            //var geometry = new THREE.BoxGeometry( BRICK_WIDTH, heightmap[i][j], BRICK_DEPTH);

            var cube = null;

            var loader = new THREE.JSONLoader();
            loader.load('./graphics/brick.json', function (geometry) {
                var material = new THREE.MeshLambertMaterial({
                    color: generateColour(heightmap[i][j]),
                    shading: THREE.FlatShading
                });
                cube = new THREE.Mesh(geometry, material);

                cube.position.x = i * BRICK_WIDTH;
                cube.position.z = j * BRICK_DEPTH;
                cube.position.y = (heightmap[i][j] / 2.0);
                cube.updateMatrix();
                cube.matrixAutoUpdate = false;

                scene.add(cube);
            });
            
        }
    }
};

var map = [
    [4.0, 5.0, 6.0],
    [3.0, 4.0, 5.0],
    [2.0, 3.0, 4.0]
];

drawLegoLandscape(map, 3);

var render = function () {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

render();