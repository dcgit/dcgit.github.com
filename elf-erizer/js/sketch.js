let isModelReady = false;
let video;
let poseNet;
let personMatches = [];
let hat;

let lastX, lastY;

let hatOffsetX, hatOffsetY;
let easingCheckbox;

let canvasHeight = Math.floor(window.innerHeight * 0.75);
let canvasWidth = Math.floor(canvasHeight * 1.33); //4:3 ration


function setup() {
	createCanvas(canvasWidth, canvasHeight+200);
	video = createCapture(VIDEO);
	video.size(canvasWidth,canvasHeight);
	video.hide();
	poseNet = ml5.poseNet(video, modelReady);
	loadImage('https://dcgit.github.io/elf-erizer/img/hat.gif', function(imgData) {
		console.log('image loaded');
		hat = imgData;
		scaledHat = imgData;
	});

	poseNet.on("pose", gotPoses);
	
	
	hatOffsetX = createSlider(-100, 100, 0, 1);
	hatOffsetX.position(20, canvasHeight + 20);
	
	hatOffsetY = createSlider(-100, 100, 0, 1);
	hatOffsetY.position(20, canvasHeight + 50);
	
	easingCheckbox = createCheckbox('Turn on easing', false);
	easingCheckbox.position(20, canvasHeight + 80);
}


function gotPoses(poses) {
	//console.log(poses);
	personMatches = [];
	if (poses && poses.length > 0) {

		//foreach person in poses
		
		poses.forEach(function(personPose,i) {
			//let person = poses[0].pose;
			let person = personPose.pose;
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
		});
	}
	else
	{
		lastX = null;
		lastY = null;
	}


}

function modelReady() {
	console.log("model ready");
	isModelReady = true;
}

function easing(oldVal, newVal) {
	let easingRate = 0.2;
	return newVal - ((newVal - oldVal) * easingRate);
}

function draw() {
	image(video, 0, 0, canvasWidth, canvasHeight);
	textSize(50);
	fill(0,255,0);
	if (isModelReady) { text("Model ready",50,50); }

	let manualOffsetX = hatOffsetX.value();
	let manualOffsetY = hatOffsetY.value();
	
	fill(220, 50, 50);

	if (personMatches.length > 0) {
		//console.log(personMatches);

		personMatches.forEach(function(person,i) {
		//console.log("Person:" + i);
		console.log(person);
		let faceWidth = person.leftEar.x - person.rightEar.x
		
		let noseEyeSpace = person.nose.y - person.leftEye.y;
		
		let hatDepthOffsetY = (noseEyeSpace * 2) + 30;

		//rotation?
		//rotate(cos(80));
		console.log(hatDepthOffsetY);
			
		//let newX = person.nose.x - (faceWidth / 2) + manualOffsetX;
		//let newY = person.nose.y - 140 - hatDepthOffsetY + manualOffsetY;
			
		let newX = person.nose.x - (faceWidth / 2) + manualOffsetX;
		let newY = person.nose.y - 140 - hatDepthOffsetY + manualOffsetY;
			
		if (lastX && lastY) {
			//newX = easing(lastX, newX);
			//newY = easing(lastY, newY);
		}
		lastX = newX;
		lastY = newY;
			
		image(hat, 
			newX, 
			newY, 
			faceWidth + 30, 
			160
		 );

			//restore canvas rotation
			//rotate(-cos(80));		
  		let eyeSpacing = (person.rightEye.x - person.leftEye.x) * 0.7;
  		ellipse(person.nose.x, person.nose.y, eyeSpacing, eyeSpacing);

		});
	}
	
	
	//refinement controls
	text("Offset X", 0, canvasHeight + 20);
	text("Offset Y", 0, canvasHeight + 50);
	
}
