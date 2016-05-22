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