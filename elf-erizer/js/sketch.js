let isModelReady = false;
let video;
let poseNet;
let personMatches = [];
let hat;

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
	console.log(poses);
	personMatches = [];
	if (poses && poses.length > 0) {

		//foreach person in poses
		let person = poses[0].pose;
		
		personMatches.push({
			"nose": {
				"x": person.keypoints[0].position.x,
				"y": person.keypoints[0].position.y
			},
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


		personMatches.forEach(function(person,i) {

		let faceWidth = person.leftEar.x - person.rightEar.x
		
		let noseEyeSpace = person.nose.y - person.leftEye.y;
		
		let hatOffsetY = (noseEyeSpace * 2) + 30;

		//rotation?
		//rotate(cos(80));
		image(hat, 
					person.nose.x - (faceWidth / 2), 
					person.nose.y - 140 - hatOffsetY, 
					faceWidth + 30, 
					160
				 );

			//restore canvas rotation
			//rotate(-cos(80));		
  		let eyeSpacing = (person.rightEye.x - person.leftEye.x) * 0.7;
			ellipse(person.nose.x, person.nose.y, eyeSpacing, eyeSpacing);

		});
	}
}
