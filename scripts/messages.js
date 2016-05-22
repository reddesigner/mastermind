/* JS */

var messages = {

	alert : function(msg){
		this.createMessageBlock(msg, "alert");
	},
	
	tip : function(msg){
		this.createTipBlock(msg);
	},
	
	createMessageBlock : function(msg, type){
		var m = "\
			<div class='message-wrapper'>\
				<div class='message message-"+type+"'>\
					<div class='message-box'>\
						<div class='message-text'>"+msg+"</div>\
						<input class='message-button' type='button' value='close'>\
					</div>\
				</div>\
			</div>"
		$("body").append(m);

		$("html").one("click", ".message-button", function(){
			$(this).parent().parent().parent().remove(); // remove .message-wrapper
		})
	},
	
	createTipBlock : function(){
		var m = "\
			<div class='tip-message'>\
				<div class='tip-message-text'>"+msg+"</div>\
			</div>"
		$("body").append(m);

		$("html").one("click", ".message-button", function(){
			$(this).parent().parent().parent().remove(); // remove .message-wrapper
		})
	}

}