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
var mm = {
	url : "https://az-mastermind.herokuapp.com",
	ep_new_game : "/new_game",
	ep_new_guess : "/guess",
	activeSpot : null,
	gkey :null,
	gcode : null,
	exact : null,
	near : null,
	user : "Username"
};

/* no $ conflict */
(function($){

	console.log("Start running...");
	
	if(state.getLocalGameKey()){
		$("#step1").hide();
		$("#step2").show();
		$("html").attr("class", "html-step-s2");
		state.reconstructHistory();
	}
	
	/* on ready */
	$(function(){

		$("#btn_gameType_Single").on("click", function(){
			$("#step1_1").show();
		});
		$("#btn_gameType_Multi").on("click", function(){
			$("#step1_2_1").show();
		});
		$("#btn_newSigleGame").on("click", function(){
			if ( $("#inp_userName").val() != "" )
				mm.user = $("#inp_userName").val();
			else {
				messages.alert("You have to inform a name!");
				return;
			}
			proxy.start(mm.user).success(function(data){
				console.log("POST new_game on API", data);
				// TODO functions for success and fail
				mm.gkey = data.game_key;
			}).error(function(data){
				console.error(data);
			});
			$("#step1").hide();
			$("#step2").show();
			$("html").attr("class", "html-step-s2");
		});
		$("#btn_newMultiGame").on("click", function(){
			if ( $("#inp_userName_Multi").val() != "" )
				mm.user = $("#inp_userName_Multi").val();
			else {
				messages.alert("You have to inform a name!");
				return;
			}
			proxy.listGames();
			$("#step1_2_1").hide();
			$("#step1_2_2").show();
		});


		/**
		/* Action
		/* Spot click opens controller to color choosing
		/* The controller (#pegs) is used and then hidden
		*/
		$("#controls").on("click", ".spot", function(e){
			e.stopPropagation();
			// target position is .spot position plus half its size...
			mm.activeSpot = $(this);
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
			mm.gcode = "";
			$("#controls .spots .spot").each(function(i){
				mm.gcode += $(this).attr("data-guess");
			});
			if (mm.gcode.indexOf("undefined") >= 0) {
				messages.alert("Fill all the blank spots!");
				return false;
			}
			proxy.guess(mm.gcode, mm.gkey).success(function(data){
				console.log(data);
				// TODO functions for success and fail
				if (data.solved == "true") console.log("CONGRATULATIONS!!!", "Time taken: "+data.time_taken);
				mm.exact = data.past_results[data.past_results.length-1].exact;
				mm.near = data.past_results[data.past_results.length-1].near;
				$("#history").prepend(""
					+"<div class='spots'><button class='repeat'>Repeat this combination</button>" 
					+ $("#controls .spots").html() + "</div><div style='padding-top: 26px'>"
					+ "Exacts: <strong>"+mm.exact+"</strong> &nbsp; | &nbsp; Near: <strong>"+mm.near+"</strong></div>");
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
			if (!mm.activeSpot) return;
			mm.activeSpot.css("background", $(this).css("background-color"));
			mm.activeSpot.attr("data-guess", $(this).attr("id"));
			$("#pegs").css("display", "none");
		});

	});

})(jQuery);

/**
/* ***************************************************
*/

/* proxy */
var proxy = {
	
	/**
	/* Action on ready
	/* Call server API for new game key
	*/
	start : function(user){
		return $.ajax({
			type: "POST",
			url: mm.url + mm.ep_new_game,
			data: { "user": user },
			dataType: "JSON"
		});
	},

	guess : function(code, key){
		console.log("function sendIt", code, key);
		return $.ajax({
			type: "POST",
			url: mm.url + mm.ep_new_guess,
			data: { "code" : code, "game_key": key },
			dataType: "JSON"
		});
	},
	
	listGames : function(){
		var gl = "\
			<option>game number one</option>\
			<option>zupa-zupa!</option>\
			<option>try me!</option>\
			<option>game group samba</option>\
			<option>hardtroll</option>\
		";
		$("#slc_gamesList").html(gl);
	}

}

/**
/* ***************************************************
*/

/* state of app */
var state = {
	
	/**
	/* Action on ready
	/* Check localstorage for existing data and, if found,
	/* compares gamekey values
	*/
	getLocalGameKey : function(){
		// TODO record and check time of last update...
		var gk = localStorage.getItem("mm_game_key");
		if (gk)
			return gk;
		else
			return false;
	},

	setLocalGameKey : function(key){
		localStorage.setItem("mm_game_key", key);
	},
	
	setGameHistory : function(history){
		
	},
	
	getGameHistory : function(){
		
	},
	
	reconstructHistory : function(){
		
	}

}