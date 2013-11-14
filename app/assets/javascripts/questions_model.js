var roomQuestionList = new QuestionList();


// Question object
function Question(q, uId, qId) {
	this.details = q;
	this.votes = 0;
	this.answered = false;
	this.paused = false;
	this.userId = uId;
	this.id = qId;
};

Question.prototype.upVote = function() {
	this.votes = this.votes + 1;
};

Question.prototype.answer = function() {
	this.answered = true;
};

// Question list object
function QuestionList() {
	this.questions = [];
};

QuestionList.prototype.sort = function() {
  this.questions = _.sort(this.questions, function(element){return element.votes;});
};

QuestionList.prototype.addQuestion = function( qObj ) {
	this.questions.push( qObj );
	// this.sort();
};

//===========


function controllerSetup(){
	$.ajax({
		url: "/json/questions",
		type: "GET",
		success: controllerBuildModel
	});
};

function controllerBuildModel(serverResponse){
	var numQuestions = serverResponse[0].questions.length;

	for (var i = 0; i < numQuestions; i++){
		var tempQuestion = new Question(serverResponse[0].questions[i].details, serverResponse[0].questions[i].user_id, serverResponse[0].questions[i].id);
		roomQuestionList.addQuestion(tempQuestion);
		viewRenderQuestion(tempQuestion);
	};
	controllerVoteSetup();
  controllerAnswerableSetup();
};

function controllerVoteSetup(){
	var numQuestions = roomQuestionList.questions.length;
	for (var i = 0; i < numQuestions; i++){

		$.ajax({
		url: "/json/questions/" + roomQuestionList.questions[i].id + "/getvotes",
		type: "GET",
		data: { question: {id: roomQuestionList.questions[i].id}},
    	success: controllerUpdateVotes
    	});

	};
};

function controllerUpdateVotes(serverResponse){
	
	var tempArray = $.map(roomQuestionList.questions, function(question, i) { return question.id });
	var index = $.inArray(serverResponse[0].question.id, tempArray);

	roomQuestionList.questions[index].votes = serverResponse[1].votes;
	viewRenderVotes(roomQuestionList.questions[index]);
};

function controllerUpdateNewQuestion(serverResponse){
	tempQuestion = new Question(serverResponse.details, serverResponse.user_id, serverResponse.id);
	roomQuestionList.addQuestion(tempQuestion);
	viewRenderQuestion(tempQuestion);
  viewRenderAnswerable(tempQuestion);
};

function viewRenderQuestion(question){
	var colors = ["red", "blue", "goldenrod", "green"];
	var outerDiv = $('<div class="item">');

	var innerDiv = $("<div class='item-content' data-val=" + question.id + ">")
	innerDiv.text(question.details);
	innerDiv.css("background", _.sample(colors));

	// build the upvote button & attach it to the inner div
	var upButton = $('<div class="upButton">&oplus;</div>');
	innerDiv.append(upButton);

	//build the votes div
	var votesDiv = $("<div class=votesDiv>0</div>")
	innerDiv.append(votesDiv);



	//append the div with the new question.
	outerDiv.append(innerDiv);
	$('div.packery').append(outerDiv);
	pckry.appended( outerDiv[0] );
}

function viewRenderVotes(question){
	var myDiv = $('div[data-val=' + question.id + ']');
	$(myDiv.children()[1]).html(question.votes);
}

function viewFormListener(){
	var form = $('.question-form');
	var session_id = $('#session_id').text();
	form.submit( function( event ) {
    event.preventDefault();

    //get the question
    var question = $('input.question').val(); 

    //clear input box now that we have input
    $('input.question').val("");

    //create ajax request with the question and the user_id
    $.ajax({
      url: "/json/questions",
      type: "POST",
      data: { question: {details: question, user_id: session_id}},
      success: controllerUpdateNewQuestion
    });
  });
}

function controllerUpVote(){
  var session_id = $('#session_id').text();
  var question_id = $(this.parentElement).data().val;
  var url = "/json/questions/" + question_id + "/vote_up";

  $.ajax({
      url: url,
      type: "POST",
      data: { question: {id: question_id}},
      success: controllerUpdateVotes
    });
}

// function controllerUpdateVotes(serverResponse){
//   console.log(serverResponse);
//   //update the model
//   //update the display

// }

function viewAddDelegatedListeners(){
  $('div.packery').on('click', 'div.upButton', controllerUpVote);
  $('div.packery').on('click', 'div.answerable', controllerAnswer);
};


function controllerAnswerableSetup(){
  var numQuestions = roomQuestionList.questions.length;
  for (var i = 0; i < numQuestions; i++){

    $.ajax({
    url: "/json/questions/" + roomQuestionList.questions[i].id + "/getanswerable",
    type: "GET",
    data: { question: {id: roomQuestionList.questions[i].id}},
      success: controllerUpdateAnswerable
      });
  };
};

function controllerUpdateAnswerable(serverResponse){
  //TODO: dry this up into a helper function aka controllerHelperMap(serverResponse)
  var tempArray = $.map(roomQuestionList.questions, function(question, i) { return question.id });
  var index = $.inArray(serverResponse[0].question.id, tempArray);

  // roomQuestionList.questions[index].votes = serverResponse[1].votes;
  viewRenderAnswerable(roomQuestionList.questions[index]);
};

function viewRenderAnswerable(question){
  var myDiv = $('div[data-val=' + question.id + ']');
  var answerableDiv = $("<div class=answerable>&radic;</div>");

  $(myDiv.children()[1]).append(answerableDiv);
}

function controllerAnswer(){
  console.log("this question was just answered!");
  // now go tell the server this question was answered!
  // TODO - this is one level higher than vote because of the nesting
  // that is happening - it shouldn't be.
  var question_id = $(this.parentElement.parentElement).data().val;

  var url = "/json/questions/" + question_id + "/answered";

  $.ajax({
      url: url,
      type: "POST",
      data: { question: {id: question_id}},
      success: controllerUpdateAnswer
    });
};

function controllerUpdateAnswer(serverResponse){
  
  //remove from the model - find it in the model.  then mark it answered
  var tempArray = $.map(roomQuestionList.questions, function(question, i) { return question.id });
  var index = $.inArray(serverResponse[0].question.id, tempArray);
  roomQuestionList.questions[index].answer();

  //remove from the dom
  viewRemoveQuestion(roomQuestionList.questions[index]);
}

function viewRemoveQuestion(question){
  var myDiv = $('div[data-val=' + question.id + ']');
  myDiv.remove();
}

window.onload = function(){
	
	controllerSetup();
 

	viewFormListener();
	viewAddDelegatedListeners();

  

};