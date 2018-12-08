let isModelReady = false;
let video;
let poseNet;
let personMatches = [];
let nose;
let hat;
let scaledHat;

function setup() {
	createCanvas(640, 480);
	video = createCapture(VIDEO);
	video.hide();
	poseNet = ml5.poseNet(video, modelReady);
	loadImage('https://dcgit.github.io/elf-erizer/img/hat.gif', function(imgData) {
		console.log('image loaded');
		hat = imgData;
		scaledHat = imgData;
	});

	poseNet.on("pose", gotPoses);
}

function gotPoses(poses) {
	//console.log(poses);
	personMatches = [];
	if (poses && poses.length > 0) {

		//foreach person in poses
		let person = poses[0].pose;
		nose = {
			"x": person.keypoints[0].position.x,
			"y": person.keypoints[0].position.y
		};

		personMatches.push({
			"nose": nose,
			"leftEye": {
				"x": person.keypoints[1].position.x,
				"y": person.keypoints[1].position.y
			},
			"rightEye": {
				"x": person.keypoints[2].position.x,
				"y": person.keypoints[2].position.y
			},
			"leftEar": {
				"x": person.keypoints[3].position.x,
				"y": person.keypoints[3].position.y
			},
			"rightEar": {
				"x": person.keypoints[4].position.x,
				"y": person.keypoints[4].position.y
			}

		});
	} else {
		nose = null;
		personMatches = [];
	}


}

function modelReady() {
	console.log("model ready");
	isModelReady = true;
}

function draw() {
	image(video, 0, 0);
	textSize(50);
	fill(0,255,0);
	if (isModelReady) { text("Model ready",50,50); }

	fill(220, 50, 50);

	if (personMatches.length > 0) {


		//console.log("LeftEar:",personMatches[0].leftEar.x);
		//console.log("RightEar:",personMatches[0].rightEar.x);
		let faceWidth = personMatches[0].leftEar.x - personMatches[0].rightEar.x
		//console.log("faceWidth:",faceWidth);

		let noseEyeSpace = personMatches[0].nose.y - personMatches[0].leftEye.y;
		console.log("NoseEyeSpace:", noseEyeSpace);
		
		let hatOffsetY = (noseEyeSpace * 2) + 30;

		//rotation?
		//rotate(cos(80));
		image(hat, 
					personMatches[0].nose.x - (faceWidth / 2), 
					personMatches[0].nose.y - 140 - hatOffsetY, 
					faceWidth + 30, 
					160
				 );

		//restore canvas rotation
		//rotate(-cos(80));
		if (nose) {

			let eyeSpacing = (personMatches[0].rightEye.x - personMatches[0].leftEye.x) * 0.7;
			ellipse(nose.x, nose.y, eyeSpacing, eyeSpacing);

		}
	}
}
