function getHeightData(img) {
    var canvas = document.createElement( 'canvas' );
    var sq = 257
    canvas.width = sq;
    canvas.height = sq;
    var context = canvas.getContext( '2d' );

    var size = sq * sq, data = new Float32Array( size );

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, sq, sq);
    var pix = imgd.data;

    var j=0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/30;
    }

    return data;
}
