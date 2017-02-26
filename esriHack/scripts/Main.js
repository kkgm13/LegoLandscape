var WIDTH = 1000;
var HEIGHT = 700;

const BRICK_WIDTH = 4;
const BRICK_HEIGHT = 2;
const BRICK_DEPTH = 4;

const MAX_HEIGHT = 300; //300 will be good

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var generateColour = function (height) {
    var colourInt = (16777214 * height) / MAX_HEIGHT;
    return colourInt.toString(16);
}

var getHexColour = function (rgbColour) {
    hexColour = '';

    for (var i = 0; i < 3; i++) {
        if (rgbColour[i].toString(16).length == 1) {
            hexColour += '0';
            hexColour += rgbColour[i].toString(16);
        } else {
            hexColour += rgbColour[i].toString(16);
        }
    }

    return hexColour;
}

var drawLegoLandscape = function (map, map2, size) {

    var ii = 0;
    var jj = 0;
    var cc = 0;

    var heightmap = map;
    var colormap = map2;
    var s = size;

    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            //var geometry = new THREE.BoxGeometry( BRICK_WIDTH, heightmap[i][j], BRICK_DEPTH)

            var loader = new THREE.JSONLoader();
            loader.load('graphics/brick.json', function (geometry) {

                var height = heightmap[jj * s + ii];

                var number = MAX_HEIGHT;

                if (jj > 0) {
                    if (heightmap[(jj - 1) * s + ii] < number) {
                        number = heightmap[(jj - 1) * s + ii];
                    }
                }

                if (jj < size - 1) {
                    if (heightmap[(jj + 1) * s + ii] < number) {
                        number = heightmap[(jj + 1) * s + ii];
                    }
                }

                if (ii > 0) {
                    if (heightmap[jj * s + (ii - 1)] < number) {
                        number = heightmap[jj * s + (ii - 1)];
                    }
                }

                if (ii < size - 1) {
                    if (heightmap[jj * s + (ii + 1)] < number) {
                        number = heightmap[jj * s + (ii + 1)];
                    }
                }

                //number = Math.floor(number) * BRICK_HEIGHT;

                number = Math.ceil(height - number);

                if (number < 1) {
                    number = 1;
                }

                for (var k = 0; k < number; k++) {
                    var material = new THREE.MeshLambertMaterial({
                        color: parseInt(getHexColour(colormap[cc]), 16),
                        shading: THREE.FlatShading
                    });


                    var cube = new THREE.Mesh(geometry, material);

                    cube.position.x = ii * BRICK_WIDTH;
                    cube.position.y = (Math.floor(height) * 2.0) - (k * BRICK_HEIGHT);
                    cube.position.z = jj * BRICK_DEPTH;
                    cube.updateMatrix();
                    cube.matrixAutoUpdate = false;

                    scene.add(cube);

                }

                ii = ii + 1;

                cc++;

                if (ii == s) {
                    ii = 0;
                    jj = jj + 1;
                }

            });
        }
    }
};

var getHeightData = function (img) {

    var canvas = document.createElement('canvas');
    var sq = 64;
    canvas.width = sq;
    canvas.height = sq;
    var context = canvas.getContext('2d');

    var size = sq * sq, data = [];

    context.drawImage(img, 0, 0);

    for (var i = 0; i < size; i++) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, sq, sq);
    var pix = imgd.data;

    var j = 0;
    for (var i = 0; i < pix.length; i += (4)) {
        var all = pix[i] + pix[i + 1] + pix[i + 2];
        data[j++] = all / 10;
    }

    return data;
}

var getColours = function (img) {

    var canvas = document.createElement('canvas');
    var sq = img.width
    canvas.width = sq;
    canvas.height = sq;
    var context = canvas.getContext('2d');

    var size = sq * sq, data = [];

    context.drawImage(img, 0, 0);

    for (var i = 0; i < size; i++) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, sq, sq);
    var pix = imgd.data;

    var j = 0;
    for (var i = 0; i < pix.length; i += (4)) {
        var all = [pix[i], pix[i + 1], pix[i + 2]];
        data[j++] = all;
    }

    return data;
}

var start = function (imgPath, colourPath) {

    scene.children.forEach(function (object) {
        scene.remove(object);
        renderer.deallocateObject(object);
    });

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);

    var light2 = new THREE.DirectionalLight(0x002288);
    light2.position.set(10, 10, 10);
    scene.add(light2);

    var light3 = new THREE.AmbientLight(0xaaaaaa);
    scene.add(light3);

    camera.position.z = 50;
    camera.position.y = 50;

    var loader = new THREE.ImageLoader();

    loader.load(
        // resource URL
        imgPath,
        // Function when resource is loaded
        function (image) {
            var heightmapImage = image;

            var colourImage;

            loader.load(
                // resource URL
                colourPath,
                // Function when resource is loaded
                function (image2) {
                    colourImage = image2;
                    drawLegoLandscape(getHeightData(heightmapImage), getColours(colourImage), image.width);
                    render();
                },
                // Function called when download progresses
                function (xhr) {

                },
                // Function called when download errors
                function (xhr) {

                }
            );
        },
        // Function called when download progresses
        function (xhr) {

        },
        // Function called when download errors
        function (xhr) {

        }
    );
}

var render = function () {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};
