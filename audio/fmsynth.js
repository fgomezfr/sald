// this file implements frequency modulation synthesis tools for creating and
// saving short audio files for game sound effects in a simple web api

var ctx = new AudioContext();

/* Notes:
 * 1. A Nyquist "sound" in WebAudio is an AudioNode; to apply something to it, attach
 *    another node to it's output, and return that node's output as the new sound.
 */

// creates an envelope, typically used for controlling amplitude over time
// note: this does not bind the new gain node to an input or output!
// todo: do i need to manually specify "ctx.currentTime" offset?
function env(t1, t2, t4, l1, l2, l3, dur){
	this.gain = ctx.createGain();
	this.gain.linearRampToValueAtTime(t1, l1);
	this.gain.linearRampToValueAtTime(t1 + t2, l2);
	this.gain.linearRampToValueAtTime(dur - t4, l3);
	this.gain.linearRampToValueAtTime(dur, 0.0);
}

// apply an envelope or some such to a sound
function mult(sound, envelope)
{
	sound.connect(envelope);
	return envelope;
}

function fmosc(){}