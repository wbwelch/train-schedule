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
			//pull time
			var freqTrain = childSnapshot.val().frequency;
			var firstTime = childSnapshot.val().firstTime;
			var firstTimeConv = moment(firstTime, "HH:mm").format("HH:mm");
			
			//parse first hour(s) and minute(s)
			var firstH = firstTimeConv.slice(0, 2);
			var firstM = firstTimeConv.slice(3, 5);
			var firstHParsed = parseInt(firstH);
			var firstMParsed = parseInt(firstM);
			//first train in minutes
			var firstHourConv = firstHParsed * 60;
			var firstTotalMin = firstHourConv + firstMParsed;
			var firstTotalMinParsed = parseInt(firstTotalMin);
			//now variable
			var now = moment().format("HH:mm");
			
			//parse now hour(s) and minute(s)
			var nowH = now.slice(0,2);
			var nowM = now.slice(3, 5);
			var nowHParsed = parseInt(nowH);
			var nowMParsed = parseInt(nowM);
			//now in minutes
			var nowHourConv = nowHParsed * 60;
			var nowTotalMin = nowHourConv + nowMParsed;
			//if future first train by at least an hour
			if (firstHParsed > nowHParsed) {
				//minutes wait is difference in time in minutes
				minutesWait = firstTotalMin - nowTotalMin;
				//first train is next train
				nextTrain = firstHParsed + ":" + firstMParsed;
				
			} 
			//if future first train same hour
			else if (firstHParsed === nowHParsed && firstMParsed > nowMParsed) {
				//minutes wait is difference in time in minutes
				minutesWait = firstTotalMin - nowTotalMin;
				//next train is first train
				nextTrain = firstHParsed + ":" + firstMParsed;
			} 
			//if past first train
			else {
				//difference in time in minutes
				var difTime = nowTotalMin - firstTotalMin;
				//minutes wait update
				minutesWait = freqTrain - (difTime % freqTrain);
				//next train time, hour
				var nowHourForNext = nowHParsed;
				//next train time, minutes
				var nextTrainMin =  nowMParsed + minutesWait;
				//if minutes for next train (in time) is > 60
				if (nextTrainMin > 60) {
					//find hours
					var loops = Math.floor(nextTrainMin / 60);
					//add hours to time
					nowHourForNext = nowHourForNext + loops;
					//next train minutes are the remainder from minutes / 60
					nextTrainMin = nextTrainMin % 60;
				}
				//if minutes for next train (in time) is 60
				else if (nextTrainMin === 60) {
					//next train minutes are 0
					nextTrainMin = nextTrainMin - 60;
				};
				//if minutes for next train (in time) is a single digit
				if (nextTrainMin < 10) {
					//add 0 to front of digit
					nextTrainMin = "0" + nextTrainMin;
				};
				//next train time
				nextTrain = nowHourForNext + ":" + nextTrainMin;
			};
		}, 
		//append to table method
		append: function () {
			$("#new-train").append( "<tr>" +
			   //train name
				"<td id='nameAdd'>" + childSnapshot.val().name  + "</td>" +
			   //train destination
				"<td id='destAdd'>" + childSnapshot.val().destination + "</td>" +
			   //train frequency
				"<td id='freqAdd'>" + "Every " + childSnapshot.val().frequency + " min." + "</td>" +
			   //first train time
				"<td id='freqAdd'>" + childSnapshot.val().firstTime + "</td>" +
			   //next train time
				"<td id='freqAdd'>" + nextTrain + "</td>" +
			   //minutes to next train
				"<td id='freqAdd'>" + minutesWait + " min." + "</td>"
				);
		}
	};
	//call calculate
	mathVar.calculate();
	//call append to table
	mathVar.append();
					
});
});

				


