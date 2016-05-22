/* JS for MasterMind, the game */

"use strict";

/**
/* Controlls
/* object with controlls variables
/*
/* activeSpot - wich spot is active on mouse click
/* gkey - game key from server API
/* gcode - guess made by user before POST
/* exact - number of right guessed itens after POST
/* near - number of almost right guessed itens after POST
*/

/**
/* APIs
/* https://az-mastermind.herokuapp.com | Axiom Zen API
/* http://devpost.com/software/mastermind-onpfhe | from slack user "quicoli" | http://vanhack-az-mastermind.azurewebsites.net/ (api)
*/

var mm_global = {
	activeSpot : null,
	gkey :null,
	gcode : null,
	gplayer : null,
	exact : null,
	near : null,
	user : "Username"
};

var mm_api_az = {
	url : "https://az-mastermind.herokuapp.com",
	ep_new_game : "/new_game",
	ep_new_guess : "/guess",
	r_gamekey : "game_key"
};

var mm_api_vh = {
	url : "http://vanhack-az-mastermind.azurewebsites.net",
	ep_new_game : "/api/mastermind/NewGame",
	ep_new_guess : "/api/mastermind/Guess",
	ep_join_game : "/api/mastermind/JoinGame",
	ep_list_games : "/api/mastermind/GamesAvailable", // GET
	r_gamekey : "GameId"
};

var mm_api = {
	url : "http://vanhack-az-mastermind.azurewebsites.net",
	ep_new_game : "/api/mastermind/NewGame",
	ep_new_guess : "/api/mastermind/Guess",
	ep_join_game : "/api/mastermind/JoinGame",
	ep_list_games : "/api/mastermind/GamesAvailable", // GET
	r_gamekey : "GameId"
};

/* no $ conflict */
(function($){

	console.log("Start running...");
	
	/* on ready */
	$(function(){

		/**
		/* TODO -> Check for local game key
		*/
		/* 
		if(state.getLocalGameKey()){
			console.log("Hey, we got a local game key!");
			$("html").attr("class", "html-step-s2");
			$("#step2").show("fast");
			state.reconstructHistory();
		}*/
		
		/**
		/* First screen!
		*/
		$("#step1").show("fast");
		
		/**
		/* Next steps - start a new game
		*/
		$("#btn_gameType_Single").on("click", function(){
			$("#step1_2_1").hide();
			$("#step1_1").show("fast");
		});
		$("#btn_gameType_Multi").on("click", function(){
			$("#step1_1").hide();
			$("#step1_2_1").show("fast");
		});

		/**
		/* Action - Start the game!
		*/
		$("#btn_newSigleGame").on("click", function(){
			if ( $("#inp_userName").val() != "" )
				mm_global.user = $("#inp_userName").val();
			else {
				messages.alert("You have to inform a name!");
				return;
			}
			proxy.start().success(function(data){
				console.log("POST on new game API end point", data);
				// TODO functions for success and fail
				mm_global.gkey = data[mm_api.r_gamekey];
				mm_global.gplayer = data.PlayerId;
				console.log("game key e player key >>>", mm_global.gkey, mm_global.gplayer);
			}).error(function(data){
				console.error(data);
			});
			$("#step1").hide("fast");
			$("#step2").show("fast");
			$("html").attr("class", "html-step-s2");
		});
		
		/**
		/*	Action - Select a multiplayer game!
		*/
		$("#btn_newMultiGame").on("click", function(){
			if ( $("#inp_userName_Multi").val() != "" )
				mm_global.user = $("#inp_userName_Multi").val();
			else {
				messages.alert("You have to inform a name!");
				return;
			}
			proxy.listGames();
			$("#step1_2_1").hide("fast");
			$("#step1_2_2").show("fast");
		});
		
		/**
		/*	Action - Start a multiplayer game!
		*/
		$("body").on("click", "select option", function(){
			mm_global.gkey = $(this).val();
			proxy.joinGame().success(function(data){
				mm_global.gplayer = data.PlayerId;
				console.log("game key e player key >>>", mm_global.gkey, mm_global.gplayer);
			}).error(function(data){
				console.error(data);		
			});
			$("#step1").hide("fast");
			$("#step2").show("fast");
			$("html").attr("class", "html-step-s2");
		});

		/**
		/* Action
		/* Spot click opens controller to color choosing
		/* The controller (#pegs) is used and then hidden
		*/
		$("#controls").on("click", ".spot", function(e){
			e.stopPropagation();
			// target position is .spot position plus half its size...
			mm_global.activeSpot = $(this);
			var p = $(this).position();
			console.log("Spot position: ", p.left, p.top);
			// pegs recieves target position minus half its own size...
			$("#pegs").css({top:p.top+36-150+"px", left:p.left+36-150+"px", display:"block"});
			$("html").one("click", function(){
				console.log("HTML one()");
				$("#pegs").css("display", "none");
			});
		});

		/**
		/* Fallback
		/* Prevent #pegs to be shown on a incorrect place on resizing 
		/* the browser window.
		*/
		$(window).on("resize", function(){
			$("#pegs").css("display", "none");
		});

		/**
		/* ***************************************************
		*/

		/**
		/* Action - Send It
		/* on button click, guess code is formed with .spot data-guess attribute value
		/* and is send to API with game key.
		*/
		$("#send").on("click", function(){
			mm_global.gcode = "";
			$("#controls .spots .spot").each(function(i){
				mm_global.gcode += $(this).attr("data-guess");
			});
			if (mm_global.gcode.indexOf("undefined") >= 0) {
				messages.alert("Fill all the blank spots!");
				return false;
			}
			proxy.guess().success(function(data){
				console.log(data);
				// TODO functions for success and fail
				if (data.solved == "true") {
					console.log(data.result, "Time taken: "+data.time_taken, "Number of guesses: "+data.num_guesses);
					messages.alert(data.result);
					controller.blockSend();
				}
				// TODO generalize diferent API paramenters
				if ( data.Players ){
					for ( var i = 0; i < data.Players.length; i++ ) {
						if (data.Players[i].Winner && data.Players[i].Name == mm_global.user) {
							messages.alert("Congrats, "+data.Players[i].Name+"! You won the game!");
							controller.blockSend();
						} else if (data.Players[i].Winner) {
							messages.alert("Ops, the player "+data.Players[i].Name+" has won.");
							controller.blockSend();
						}
						// TODO we have to make a fallback if players have the same name!
						if (data.Players[i].Name == mm_global.user) {
							mm_global.exact = data.Players[i].GuessHistory[data.Players[i].GuessHistory.length-1].ExactCount;
							mm_global.near = data.Players[i].GuessHistory[data.Players[i].GuessHistory.length-1].NearCount
						}
					}
				} else {
					mm_global.exact = data.past_results[data.past_results.length-1].exact;
					mm_global.near = data.past_results[data.past_results.length-1].near;
				}
				console.log("exacts and nears >>>", mm_global.exact, mm_global.near);
				$("#history").prepend("\
					<div class='historyEntry'>\
						<div class='spots'>\
							<button class='repeat'>Repeat this combination</button>"+
							$("#controls .spots").html() + "\
						</div>\
						<div class='results'>\
							Exacts: <strong>"+mm_global.exact+"</strong> &nbsp; | &nbsp; Near: <strong>"+mm_global.near+"</strong>\
						</div>\
					</div>\
				");
				$("#controls .spot").each(function(i){
					if (!$("#controls .fixes input:nth-child("+(i+1)+"):checked").length)
						$(this).removeAttr("data-guess").removeAttr("style");
				});
			}).error(function(data){
				console.error(data);
			});
		})

		$("#history").on("click", ".repeat", function(){
			$("#controls .spots").html($(this).parent().find(".spot").clone());
		});

		$("#colors div").on("click", function(){
			if (!mm_global.activeSpot) return;
			mm_global.activeSpot.css("background", $(this).css("background-color"));
			mm_global.activeSpot.attr("data-guess", $(this).attr("id"));
			$("#pegs").css("display", "none");
		});

	});

})(jQuery);

/**
/* ***************************************************
*/

var controller = {
	blockSend : function(){
		$("#send").attr("disabled", "disabled");
	}
}
