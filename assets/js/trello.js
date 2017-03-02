// Authentication

var sSelectBoard = $("#board");
// Key & token

var sAuth;

var sSelectList = $("#list");

var authenticationSuccess = function(){ 
	// Change text of button to "Success"
	$("#authentication").text("Success"); 

	sAuth = {
	"key" : Trello.key() , 
	"token": Trello.token()
	}

	// Create Board list
	if (sSelectBoard[0] == undefined || sSelectBoard.children().length > 1) { return;}

	$.getJSON("https://api.trello.com/1/members/me/",sAuth,function(response){
			var listOfBoard = response.idBoards;
			listOfBoard.forEach(function(id){
				var link = "https://api.trello.com/1/boards/" + id;
				var field = {
					"field" : "name"
				}
				
				jQuery.extend(field,sAuth);
				$.getJSON(link,field,function(board){
					var optionText = "<option value='"+ board.id + "'>"+board.name + "</option>";
					sSelectBoard.append(optionText);
				}); 
			});
	});
};

var authenticationFailure = function() { $("#authentication").text("Failed") };

$("#authentication").on("click",function(){


	Trello.authorize({
	  type: 'popup',
	  name: 'Getting Started Application',
	  scope: {
	    read: 'true',
	    write: 'true' },
	  expiration: 'never',
	  success: authenticationSuccess,
	  error: authenticationFailure
	});
});

sSelectBoard.on("change",function(){
	// remove all select of list
	$("#list option:nth-child(n+2)").remove();
	
	var idBoard = sSelectBoard.val();
	var link = "https://api.trello.com/1/boards/" + idBoard;
	var field = {
		"lists" : "open",
		"list_fields" : "name",
		"fields" : "name"
	};
	jQuery.extend(field,sAuth);

	$.getJSON(link,field,function(allList){
		allList.lists.forEach(function(eList){
			var optionText = "<option value='"+ eList.id + "'>"+ eList.name + "</option>";
					sSelectList.append(optionText);
		}); 
	});				
});

sSelectList.on("change",function(){

	if ($("pre")[0] == undefined)
		return;

	$("pre").text("");
	
	var idList = sSelectList.val();
	var link = "/list/"+idList+"/";

	var field = {
		"cards" : "open",
		"card_fields" : "name,desc",
		"fields" : "name",
		"board_fields" : "name"
	};
	jQuery.extend(field,sAuth);

	Trello.get(link,field,function(listOfCard){
		var i=1;
		var pre = $("pre");
		listOfCard.cards.forEach(function(card){
			var stringCard = "<li> Name: " + card.name + " </li>" + "<li> Description: " + card.desc + "</li>";
			pre.append("<ul> Card number " + i + ": " + stringCard + "</ul>");
			i++;
		});
	});				
});

$("#trello-create").on("click",function(){
	var newCard = {
		"name" : $("#input-card-name").val(),
		"desc" : $("#input-description-card").val(),
		"idList" : sSelectList.val()
	}

	Trello.post('/cards/', newCard, function() {console.log("success") }, function() {console.log("error") });

	$("#input-card-name").val("");
	$("#input-description-card").val("");

});


