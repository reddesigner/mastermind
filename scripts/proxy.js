/**
/* ***************************************************
*/

/* proxy */
var proxy = {
	
	/**
	/* Action on ready
	/* Call server API for new game key
	*/
	start : function(){
		return $.ajax({
			type: "POST",
			//contentType: "application/json",
			crossDomain: true,
			url: mm_api.url + mm_api.ep_new_game,
			data: { "user" : mm_global.user, "Nickname" : mm_global.user, "NumberOfPlayers" : 1 },
			dataType: "JSON"
		});
	},

	guess : function(){
		// a little hack to change colors letters! M -> W
		var sequence = mm_global.gcode;
		var index = sequence.indexOf("m");
		sequence = sequence.substr(0, index) + 'w' + sequence.substr(index + 1);//
		return $.ajax({
			type: "POST",
			//contentType: "application/json",
			crossDomain: true,
			url: mm_api.url + mm_api.ep_new_guess,
			data: { "code" : mm_global.gcode, "game_key": mm_global.gkey, "GameId" : mm_global.gkey, "PlayerId" : mm_global.gplayer, "Sequence" : sequence },
			dataType: "JSON"
		});
	},
	
	listGames : function(){
		$.ajax({
			type: "GET",
			//contentType: "application/json",
			crossDomain: true,
			url: mm_api.url + mm_api.ep_list_games,
			success : function(data){
				var gl = "";
				for (var i = 0; i < data.length; i++ ){
					gl += "<option valuer='"+data[i].GameId+"'>"+data[i].GameId+"</option>"
				}
				$("#slc_gamesList").html(gl);
			},
			dataType: "JSON"
		});
		/*var gl = "\
			<option>game number one</option>\
			<option>zupa-zupa!</option>\
			<option>try me!</option>\
			<option>game group samba</option>\
			<option>hardtroll</option>\
		";
		$("#slc_gamesList").html(gl);
		*/
	},
	
	joinGame : function(){
		return $.ajax({
			type: "POST",
			//contentType: "application/json",
			crossDomain: true,
			url: mm_api.url + mm_api.ep_join_game,
			data: { "GameId" : mm_global.gkey, "Nickname" : mm_global.user },
			dataType: "JSON"
		});
	}

}