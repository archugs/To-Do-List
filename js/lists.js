// Plugin to call to cycle color
jQuery.fn.nextColor = function() {
	var curColor = $(this).attr("class");

	if (curColor == "colorBlue") {
		$(this).removeClass("colorBlue").addClass("colorYellow").attr("color", "2");
	}
	else if (curColor == "colorYellow") {
		$(this).removeClass("colorYellow").addClass("colorRed").attr("color", "3");
	}
	else if (curColor == "colorRed") {
		$(this).removeClass("colorRed").addClass("colorGreen").attr("color", "4");
	}
	else {
		$(this).removeClass("colorGreen").addClass("colorBlue").attr("color", "1");
	};
};

function saveListOrder(itemID, itemREL) {
	var i = 1,
		currentListID = $('#current-list').val();
	$('#list li').each(function() {
		if($(this).attr('id') == itemID) {
			var startPos = itemREL,
				currentPos = i;
			if(startPos < currentPos) {
				var direction = 'down';
			}
			else {
				var direction = 'up';
			}
			var postURL = "action=sort&currentListID=" + currentListID + "&startPos=" + startPos +
				"&currentPos=" + currentPos +
				"&direction=" + direction;

			$.ajax({
				type: 'POST',
				url: "db-interaction/lists.php",
				data: postURL,
				success: function(msg) {
					//Resets the rel attribute to reflect current positions
					var count = 1;
					$('#list li').each(function() {
						$(this).attr('rel', count);
						count ++;
					});
				},
				error: function(msg) {
					//alert(msg); debugging
				}
			});
		}
		i ++;
	});
}

// This is separated to a function so that it can be called at page load
// as well as when new list items are appended via AJAX
function bindAllTabs(editableTarget) {
	$(editableTarget).editable("db-interaction/lists.php", {
		id : 'listItemID',
		indicator : 'Saving...',
		tooltip : 'Double-click to edit...',
		event : 'dblclick',
		submit : 'Save',
		submitdata : {action : "update"}
	});
}

function initialize() {

	//Wrap list text in a span and apply functionality tabs
	$("#list li")
		.wrapInner("<span>")
		.append("<div class='draggertab tab'></div><div class='colortab tab'></div><div class='deletetab tab'></div><div class='donetab tab'></div>");
/*		.each(function() {
			if($(this).find("img.crossout").length)
			{	
				$(this).find("span").css({
					opacity : .5
				})
			}
		});

*/
	bindAllTabs("#list li span");

	//Make the list Sortable via JQuery UI
	//calls the SaveListOrder function after a change
	//waits for one second first, for the DOM to set, otherwise, its too fast.
	$("#list").sortable( {
		handle	: ".draggertab",
		update  : function(event, ui) {
			var id = ui.item.attr('id'),
			rel = ui.item.attr('rel'),
			t = setTimeout("saveListOrder('" + id + "', '"+ rel + "')", 100);
		},
		forcePlaceholderSize: true
	});
	
	// The SPANS need ID's for the CLICK-TO-EDIT
	// "listitem" is appended to avoid conflicting IDs and stripped by PHP
	$('#list li span').each(function() {
		$(this).attr("id", $(this).parent().attr("id") + "listitem");
	});

	//AJAX style adding of list items
	$("#add-new").submit(function(){
		// HTML tag whitelist. All other tags are stripped.
		var $whitelist = '<b><i><strong><em><a>',
			forList = $("#current-list").val(),
			newListItemText = $("#new-list-item-text").val(),
			URLtext = escape(newListItemText),
			newListItemRel = $('#list li').size()+1;
	
		if(newListItemText.length > 0) {
			$.ajax({
				type: 'POST',
				url: "db-interaction/lists.php",
				data: "action=add&list=" + forList + "&text=" + URLtext + "&pos=" + newListItemRel, 
				success: function(theResponse) {
					$("#list").append("<li color='1' class='colorBlue' rel='" + newListItemRel + "' id='" + theResponse + "'><span id=\"" + theResponse + "listitem\" title='Click to edit...'>" + newListItemText + "</span><div class='draggertab tab'></div><div class='colortab tab'></div><div class='deletetab tab'></div><div class='donetab tab'></div></li>");
					bindAllTabs("#list li[rel='"  + newListItemRel +  "'] span");
					$("#new-list-item-text").val("");
				},
                	
				error : function(msg) {
					//alert(msg);
				} 
			});
		}
		else {
			$("#new-list-item-text").val("");
		}
		return false; //prevent default form submission
	});

	$(".donetab").live("click", function() {
		var id = $(this).parent().attr('id');
		if(!$(this).siblings('span').children('img.crossout').length) {
			$(this)
				.parent()
					.find("span")
					.append("<img src='../images/crossout.png' class='crossout' />")
					.find(".crossout")
					.animate({
						width: "100%"
					})
					.end()
				.animate( {
					opacity: "0.5"
				},
				"slow",
				"swing",
				toggleDone(id, 1));
		}

		else
		{
			$(this)
				.siblings('span')
					.find('img.crossout')
						.remove()
						.end()
					.animate( {
						opacity : 1
					},
					"slow",
					"swing",
					toggleDone(id, 0));
		}
	});

	function toggleDone(id, isDone)
	{
		$.ajax({
			type: "POST",
			url: "db-interaction/lists.php",
			data: "action=done&id=" + id + "&done=" + isDone
		})
	}

	// Color cycling
	$(".colortab").live("click", function() {
		$(this).parent().nextColor();
		var id = $(this).parent().attr("id"),
			color = $(this).parent().attr("color");
		$.ajax({
			type: "POST",
			url: "db-interaction/lists.php",
			data: "action=color&id=" + id + "&color=" + color,
			success: function(msg) {
				//alert(msg); //for debugging
			}
		});
	});



	// AJAX style deletion of list items
	$(".deletetab").live("click", function() {
		var thiscache = $(this),
			list = $('#current-list').val(),
			id = thiscache.parents().attr("id"),
			pos = thiscache.parents('li').attr('rel');

		if(thiscache.data("readyToDelete") == "go for it") {
			$.ajax( {
				type: "POST",
				url: "db-interaction/lists.php",
				data: {
					"list": list,
					"id": id,
					"action": "delete",
					"pos": pos
				},
				success : function(r) {
					var $li = $('#list').children('li'),
						position = 0;
					thiscache
						.parent()
							.hide("explode", 400, function() {$(this).remove()});
					$('#list')
						.children('li')
							.not(thiscache.parent())
							.each(function() {
								$(this).attr('rel', position);
							});
					},
				error: function() {
					$("#main").prepend("Deleting the item failed...");
				}
		
			});
		}
		else {
			thiscache.animate( {
				width : "44px",
				right : "-64px"
			}, 200)
			.data("readyToDelete", "go for it");
		}
	});
}
