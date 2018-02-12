// JavaScript Document
$( document ).ready(function(){
//firebase var
var config = {
    apiKey: "AIzaSyBZu8Z1L5F_kSDjDzmP7IbDYWJrT3E0en8",
    authDomain: "train-schedule-b548f.firebaseapp.com",
    databaseURL: "https://train-schedule-b548f.firebaseio.com",
    projectId: "train-schedule-b548f",
    storageBucket: "",
    messagingSenderId: "249789655072"
  };
//initialize firebase
firebase.initializeApp(config);

//database var
var database = firebase.database();

//on click listener
$("#submit").on("click", function() {
	//prevent submit default
	event.preventDefault();
		//variables
		var frequency = $("#frequency").val().trim();
		var time = $("#first-time").val().trim();
		var min = time.slice(-2);
		
		//if not a number
		if (isNaN(frequency)) {
			$("#invalid-char").empty();
			$("#invalid-char").append("<span style='color:red;'> Please enter a valid number.</span>");
		} 
		//if time inappropriate format
		else if (min > 59) {
			$("#invalid-time").empty();
			$("#invalid-time").append("<span style='color:red;'> Please enter a valid time.</span>");
		}
		//database entry by user
		else {
			//clear error messages
			$("#invalid-char").empty();
			$("#invalid-time").empty();
			//entry variables
			var name = $("#name").val().trim();
			var destination = $("#destination").val().trim();
			var firstT = $("#first-time").val().trim();
			//database push
			database.ref().push({
				name: name,
				destination: destination,
				firstTime: firstT,
				frequency: frequency,
				timeAdded: firebase.database.ServerValue.TIMESTAMP
			});
		};
});
					
//when database child added
database.ref().on("child_added", function(childSnapshot) {
	//math object
	var mathVar = {
		//next train time
		nextTrain: "00:00",
		//minutes to wait
		minutesWait: 0,
		//calculate time to next train
		calculate: function () {
			
			var freqTrain = childSnapshot.val().frequency;
			var firstTime = childSnapshot.val().firstTime;
			var firstTimeConv = moment(firstTime, "HH:mm").format("HH:mm");
			
			var firstH = firstTimeConv.slice(0, 2);
			var firstM = firstTimeConv.slice(3, 5);
			var firstHParsed = parseInt(firstH);
			var firstMParsed = parseInt(firstM);

			var firstHourConv = firstHParsed * 60;
			var firstTotalMin = firstHourConv + firstMParsed;
			var firstTotalMinParsed = parseInt(firstTotalMin);
			
			var now = moment().format("HH:mm");
			
			var nowH = now.slice(0,2);
			var nowM = now.slice(3, 5);
			var nowHParsed = parseInt(nowH);
			var nowMParsed = parseInt(nowM);

			var nowHourConv = nowHParsed * 60;
			var nowTotalMin = nowHourConv + nowMParsed;
			
			if (firstHParsed > nowHParsed) {
				
				var difTime = firstTotalMin - nowTotalMin;
				
				var nowHourForNext = firstHParsed;
				var nextTrainMin = firstMParsed;
			
				var hourWaitTemp = firstHParsed - nowHParsed;
				var minConv = hourWaitTemp * 60;
				
				minutesWait = difTime;
			
				nextTrain = nowHourForNext + ":" + nextTrainMin;
				
			} 
			else if (firstHParsed === nowHParsed && firstMParsed > nowMParsed) {
				var difTime = firstTotalMin - nowTotalMin;
				
				var nowHourForNext = firstHParsed;
				var nextTrainMin = firstMParsed;
			
				var hourWaitTemp = firstHParsed - nowHParsed;
				var minConv = hourWaitTemp * 60;
				
				minutesWait = difTime;
			
				nextTrain = nowHourForNext + ":" + nextTrainMin;
			} 
			else {
			
				var difTime = nowTotalMin - firstTotalMin;

				minutesWait = freqTrain - (difTime % freqTrain);

				var nowHourForNext = nowHParsed;

				var nextTrainMin =  nowMParsed + minutesWait;
				if (nextTrainMin > 60) {
					var minHolder = nextTrainMin % 60;
					var loops = Math.floor(nextTrainMin / 60);
					nowHourForNext = nowHourForNext + loops;
					nextTrainMin = minHolder;
				}
				else if (nextTrainMin > 59) {
					nextTrainMin = nextTrainMin - 60;
				};
				if (nextTrainMin < 10) {
					nextTrainMin = "0" + nextTrainMin;
				};

				nextTrain = nowHourForNext + ":" + nextTrainMin;
			};
		}, 
		
		append: function () {
			$("#new-train").append( "<tr>" +
				"<td id='nameAdd'>" + childSnapshot.val().name  + "</td>" +
				"<td id='destAdd'>" + childSnapshot.val().destination + "</td>" +
				"<td id='freqAdd'>" + "Every " + childSnapshot.val().frequency + " min." + "</td>" +
				"<td id='freqAdd'>" + childSnapshot.val().firstTime + "</td>" +
				"<td id='freqAdd'>" + nextTrain + "</td>" +
				"<td id='freqAdd'>" + minutesWait + " min." + "</td>"
				);
		}
	};
	
	mathVar.calculate();
	mathVar.append();
					
});
});

				


