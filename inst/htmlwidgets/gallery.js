HTMLWidgets.widget({
	name: "gallery",
	type: "output",

	factory: function(el, width, height) {
		var gallery_id = "#" + el.id + " .gallery-container";

		return {
			renderValue: function(opts) {
				if (!$(gallery_id).length) {
					if (opts.options.selectLabel == null) {
						opts.options.selectLabel = "records per page";
					}

					if (opts.options.infoLabel == null) {
						opts.options.infoLabel = "%s to %s of %s entries";
					}

					$(el).html("<div class=\"gallery-container\"></div>");
					$(el).append("<div class=\"jp_bottom\"></div>");

					$(el).find(".jp_bottom").append(
						"<div class=\"jp_info\"></div>",
						"<div class=\"jp_select\"></div>",
						"<div class=\"jp_pagination\"></div>"
					);

					$(el).find(".jp_select").append(
						"<label><select name=\"jp_length\" class=\"form-control " +
						"input-sm\"></select> " + opts.options.selectLabel + "</label>"
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

					create_pagination(el, opts, height);

					$(el).find(".jp_bottom select").change(function() {
						$(el).find(".jp_pagination").jPages("destroy");
						opts.options.perPage = parseInt($(this).val());

						create_pagination(el, opts, height);
					});
				} else {
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
		perPage: opts.options.perPage,
		perRow: opts.options.perRow,
		box: get_box_options(opts),

		first: false, last: false,
		previous: false, next: false,

		callback: function(pages, items) {
			$(el).find(".jp_info").html(
				vsprintf(
					opts.options.infoLabel, [items.range.start, 
					items.range.end, items.count]
				)
			);

			$(el).find(".box-option div").each(function(index) {
				$(this).on("click", function() {
					if (HTMLWidgets.shinyMode) {
						var data_action = $(this).attr("data-action");

						var data_id = $(this).closest("div.box");
						var data_id = $(data_id).attr("data-id");

						Shiny.setInputValue(el.id + "_click_id", data_id);
						Shiny.setInputValue(el.id + "_click_value", data_action);
					}
				});
			});

			$(el).find("img.lazy").lazyload({effect: "fadeIn"});
		}
	});
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

	if (opts.options.detailsLabel) {
		box_options.splice(1, 0, vsprintf(box_option, [
			"details", "info", opts.options.detailsLabel
		]));
	}

	return box_options;
}
