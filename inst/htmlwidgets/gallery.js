HTMLWidgets.widget({
	name: "gallery",
	type: "output",

	factory: function(el, width, height) {
		var gallery_id = "#" + el.id + " .gallery-container";

		return {
			renderValue: function(opts) {
				if (opts.options.selectLabel == null) {
					opts.options.selectLabel = "records per page";
				}

				if (opts.options.infoLabel == null) {
					opts.options.infoLabel = "%s to %s of %s entries";
				}

				if (opts.options.limits != null) {
					if (opts.options.numberObjects != null) {
						var data = new Array(opts.options.numberObjects);

						for (var i = 0; i < opts.data.length; i++) {
							data[opts.options.limits[0] + i - 1] = opts.data[i];
						}

						opts.data = data;
					}
				}

				if (!$(gallery_id).length) {
					$(el).html("<div class=\"gallery-container\"></div>");
					$(el).append("<div class=\"jp_bottom\"></div>");

					$(el).find(".jp_bottom").append(
						"<div class=\"jp_info\"></div>",
						"<div class=\"jp_filter\"></div>",
						"<div class=\"jp_select\"></div>",
						"<div class=\"jp_pagination\"></div>"
					);

					$(el).find(".jp_select").append(
						"<label><select name=\"jp_length\" class=\"form-control input-sm\">" +
						"</select> <span>" + opts.options.selectLabel + "</span></label>"
					);

					for (var i = 4; i >= 1; i--) {
						var new_PerPage = opts.options.perPage * i;

						if (i == 1) {
							$(el).find("select[name =\"jp_length\"]").prepend(
								"<option value=\"" + new_PerPage + "\" selected>" + 
								new_PerPage + "</option>"
							); 
						} else {
							$(el).find("select[name =\"jp_length\"]").prepend(
								"<option value=\"" + new_PerPage + "\">" + 
								new_PerPage + "</option>"
							); 
						}
					}

					if (opts.options.search) {
						$(el).find(".jp_filter").append(
							"<input type=\"search\" class=\"query form-control " +
							"input-sm\" placeholder=\"Filter\">"
						);
					}

					create_pagination(el, opts, height);

					$(el).find(".jp_bottom select").change(function() {
						$(el).find(".jp_pagination").jPages("destroy");
						opts.options.perPage = parseInt($(this).val());

						create_pagination(el, opts, height);
					});

					$(el).find(".query").on("keypress change", function(event) {
						if (event.which == 13) {
							var query = $(el).find(".query").val();

							if (HTMLWidgets.shinyMode) {
								Shiny.setInputValue(el.id + "_filter", query, {priority: "event"});
							}
						}
					});

					if (opts.options.loading) {
						$(document).on("shiny:busy", function(event) {
							add_loader("#" + el.id, gallery_id);
						});
					}

					$(document).on("shiny:idle", function(event) {
						$(el).css({"height": "auto"});
						remove_loader("#" + el.id);
					});
				} else {
					$(el).find("select[name =\"jp_length\"]").val(opts.options.perPage);
					$(el).find(".jp_select span").text(opts.options.selectLabel);

					$(el).find(".jp_pagination").jPages("destroy");
					create_pagination(el, opts, height);
				}
			},

			resize: function(width, height) {
				
			}
		};
	}
});

function create_pagination(el, opts, height) {
	$(el).find(".jp_pagination").jPages({
		container: "#" + el.id + " .gallery-container", 
		items: opts.data, height: height, 
		
		startPage: opts.options.startPage, box: get_box_options(opts),
		perPage: opts.options.perPage, perRow: opts.options.perRow,

		first: false, last: false,
		previous: false, next: false,

		callback: function(pages, items) {
			var per_page = parseInt($(el).find("select :selected").val());
			$(el).find("img.lazy").lazyload({effect: "fadeIn"});

			Shiny.setInputValue(el.id + "_page_range", [items.range.start, items.range.end]);
			Shiny.setInputValue(el.id + "_page_id", pages.current);
			Shiny.setInputValue(el.id + "_per_page", per_page);

			$(el).find(".jp_info").html(
				vsprintf(opts.options.infoLabel, [items.range.start.toLocaleString(), 
					items.range.end.toLocaleString(), items.count.toLocaleString()])
			);

			$(el).find(".box-option div").each(function(index) {
				$(this).on("click", function() {
					if (HTMLWidgets.shinyMode) {
						var data_id = $(this).closest("div.box");

						var data_resource_id = $(data_id).attr("data-resource-id");
						var data_id = $(data_id).attr("data-id");

						var data_action = $(this).attr("data-action");
						add_success(data_action, seconds = 400);

						Shiny.setInputValue(el.id + "_click_id", data_id, {priority: "event"});
						Shiny.setInputValue(el.id + "_click_resource_id", data_id, {priority: "event"});
						Shiny.setInputValue(el.id + "_click_value", data_action, {priority: "event"});
					}
				});
			});

			var offset_x = null;
    		var offset_y = null;

    		if (opts.options.draggable) {
				$("#" + el.id + " .box").draggable({
					cursor: "move", stack: ".box", helper: "clone", zIndex: 10000, 
					distance: 10, tolerance: "pointer", revert: "invalid", 
					helper: function(event) {
						var html = "<div class=\"jstree-draggable\">" +
								   "   <span class=\"fa-stack fa-2x\">" + 
								   "      <i class=\"fa fa-rectangle-landscape fa-stack-2x fa-inverse\"></i>" +
								   "      <i class=\"fa fa-image fa-stack-2x\"></i>" +
								   "   </span>" +
								   "</div>";

						return $(html);
					},
					start: function(event, ui) {
						offset_x = event.clientX - ui.offset.left;
						offset_y = event.clientY - ui.offset.top;
					},
					drag: function(event, ui) {
						ui.position.left += offset_x - Math.floor(ui.helper.outerWidth() / 2);
						ui.position.top += offset_y - Math.floor(ui.helper.outerHeight() / 2);   
					}
				});
    		}
		}
	});
}

function drop_item(el, ui, data_action="add") {
	var data_id = $(ui.draggable).attr("data-id");
	add_success(data_action, seconds = 400);

	Shiny.setInputValue(el.id + "_click_id", data_id, {priority: "event"});
	Shiny.setInputValue(el.id + "_click_value", data_action, {priority: "event"});
}

function get_box_options(opts) {
	var box_options = [];

	var box_option = "<li>" +
		"  <div data-action=\"%s\">" +
		"    <i class=\"fa fa-%s-circle\"></i>" +
		"    <span>%s</span>" +
		"  </div>" +
		"</li>";

	if (opts.options.addLabel) {
		box_options.splice(1, 0, vsprintf(box_option, [
			"add", "plus", opts.options.addLabel
		]));
	}

	if (opts.options.removeLabel) {
		box_options.splice(1, 0, vsprintf(box_option, [
			"remove", "minus", opts.options.removeLabel
		]));
	}

	if (opts.options.detailsLabel) {
		box_options.splice(1, 0, vsprintf(box_option, [
			"details", "info", opts.options.detailsLabel
		]));
	}

	return box_options;
}

function add_loader(container_id, gallery_id) {
	var html = "<div class=\"loader fa-3x\"><i class=\"fas " +
			   "fa-circle-notch fa-spin\"></i></div>";

	$(html).hide().appendTo(container_id).fadeIn();
}

function remove_loader(container_id) {
	$(container_id).find(".loader").fadeOut().remove();
}

function add_success(data_action, seconds = 5000) {
	if (data_action != "details") {
		var html = "<div class=\"success\">" +
				   "   <div class=\"fa-layers\">" + 
				   "      <i class=\"fas fa-box-heart fa-3x\"></i>" + 
				   "      <span class=\"fa-stack\">" + 
				   "         <i class=\"fas fa-circle fa-stack-2x fa-inverse\"></i>" +
				   "         <i class=\"far fa-%s fa-stack-2x\"></i>" + 
				   "      </span>"
				   "   </div>" +
				   "</div>"

		if (data_action == "remove") html = vsprintf(html, ["minus-circle"]);
		if (data_action == "move") html = vsprintf(html, ["arrow-alt-circle-left"]);
		if (data_action == "add") html = vsprintf(html, ["plus-circle"])

		$(html).hide().appendTo("body").fadeIn();
	
		$("body").children(":last").delay(seconds).fadeOut(400, function() {
			$(this).remove();
		});
	}
}