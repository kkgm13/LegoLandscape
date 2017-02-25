/**
 * Created by harvey on 25/02/17.
 */
importScripts("http://js.leapmotion.com/leap-0.6.3.js");
function getPos() {
    var controller = Leap.loop();
    var frame = controller.frame();
    var hand = frame.hands[0];
    var pos = hand.stabilizedPalmPosition;
    return pos;
}