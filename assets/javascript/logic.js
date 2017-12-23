// JavaScript Document
$( document ).ready(function(){

var config = {
    apiKey: "AIzaSyBZu8Z1L5F_kSDjDzmP7IbDYWJrT3E0en8",
    authDomain: "train-schedule-b548f.firebaseapp.com",
    databaseURL: "https://train-schedule-b548f.firebaseio.com",
    projectId: "train-schedule-b548f",
    storageBucket: "",
    messagingSenderId: "249789655072"
  };

  firebase.initializeApp(config);

var database = firebase.database();



//var randomTime = "12:47";
//var randomFormat = "00:00 PM";
//var convertedDate = moment(randomTime, randomFormat);

//var currentHour = moment().hour();
//var currentMin = moment().minutes();



//if 12 or smaller, print time as is + AM. If 13 or higher, convert and then print

$("#submit").on("click", function() {
	event.preventDefault();
	
		var frequency = $("#frequency").val().trim();
		var time = $("#first-time").val().trim();
		var min = time.slice(-2);
	
		if (isNaN(frequency)) {
			$("#invalid-char").empty();
			$("#invalid-char").append("<span style='color:red;'> Please enter a valid number.</span>");
			} 
			else if (min > 59) {
				$("#invalid-time").empty();
			$("#invalid-time").append("<span style='color:red;'> Please enter a valid time.</span>");
			}
			else {
			
		
				$("#invalid-char").empty();
				$("#invalid-time").empty();
				var name = $("#name").val().trim();
				var destination = $("#destination").val().trim();
				var firstT = $("#first-time").val().trim();
				
				


				database.ref().push({
					name: name,
					destination: destination,
					firstTime: firstT,
					frequency: frequency,
					//dateAdded: firebase.database.ServerValue.TIMESTAMP
					timeAdded: firebase.database.ServerValue.TIMESTAMP

					});
			};
});
					

database.ref().on("child_added", function(childSnapshot) {

	  // Log everything that's coming out of snapshot
	  //console.log(childSnapshot.val().name);
	  //console.log(childSnapshot.val().destination);
	  //console.log(childSnapshot.val().firstTime);
	  //console.log(childSnapshot.val().frequency);
	  //console.log(childSnapshot.val().timeAdded);

//incoorperate moment 
	var math = {
		
		nextTrain: "00:00",
		minutesWait: 0,
		
		calculate: function () {
			var freqTrain = childSnapshot.val().frequency;
			console.log("Frequency: " + freqTrain);
			
			var firstTime = childSnapshot.val().firstTime;
			var firstTimeConv = moment(firstTime, "HH:mm").format("HH:mm");
			console.log("First train: " + firstTime);
			
			var firstH = firstTimeConv.slice(0, 2);
			var firstM = firstTimeConv.slice(3, 5);
						console.log("firstM: " + firstM);

			var firstHourConv = firstH * 60;
			var firstTotalMin = firstHourConv + firstM;
						console.log("First min total: " + firstTotalMin);
			
			var now = moment().format("HH:mm");
						console.log("Now: " + now);
			var nowH = now.slice(0,2);
			var nowM = now.slice(3, 5);
						console.log("nowM: " + nowM);
			var nowHourConv = nowH * 60;
			var nowTotalMin = nowHourConv + nowM;
						console.log("Now min total: " + nowTotalMin);
			
			var difTime = nowTotalMin - firstTotalMin;
			//console.log("Difference in min: " + difTime);
			minutesWait = freqTrain - (difTime % freqTrain);
			
			var nowHourForNext = nowH
			//now + minutes wait
			
			var nextTrainMin =  nowM + minutesWait
			
			if (nextTrainMin > 59) {
				nowHourForNext + 1;
				nextTrainMin = nextTrainMin - 59;
			};
			
			nextTrain = nowHourForNext + ":" + nextTrainMin.toString().slice(0, 2);
			
			
			
			//nextTime = now + minutesWait
			//update nextTrain variable
			//update minutesWait variable
		}
	};
	math.calculate();
					
	$("#new-train").append( "<tr>" +
		"<td id='nameAdd'>" + childSnapshot.val().name  + "</td>" +
		"<td id='destAdd'>" + childSnapshot.val().destination + "</td>" +
		"<td id='freqAdd'>" + "Every " + childSnapshot.val().frequency + " min." + "</td>" +
		"<td id='freqAdd'>" + nextTrain + "</td>" +
		"<td id='freqAdd'>" + minutesWait + " min." + "</td>"
		);
});
});

				


