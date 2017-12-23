// JavaScript Document

$("#sumbit").on("click", function() {
	event.preventDefault();
	
	name = $("#name").val().trim();
	destination = $("#destination").val().trim();
	firstTrain = $("#first-time").val().trim();
	frequency = $("#frequency").val().trim();
	//21st day index.html for example code
	
	$("#submit").on("click", function() {
		var freq = $("#frequency").val().trim();
		//evt = (evt) ? evt : window.event;
		//var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (freq == number) {
			return false;
			$("#invalid-char").text("Please enter a valid number.");
		}
		return true;
	});
	
});