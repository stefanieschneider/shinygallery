HTMLWidgets.widget({
	name: "gallery",
	type: "output",

	factory: function(el, width, height) {
		return {
			renderValue: function(opts) {
				if (opts.options.selectLabel == null) {
					opts.options.selectLabel = "records per page";
				}

				if (opts.options.infoLabel == null) {
					opts.options.infoLabel = "%s to %s of %s entries";
				}

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

				var element_width = parseInt(12 / opts.options.perRow);

				var box = "<div class=\"col-sm-%s\">" +
						  "  <div class=\"box\" data-id=\"%s\">" +
						  "    <div class=\"box-option\"><ul>%s</ul></div>" +
						  "    <div class=\"box-image\" style=\"height: %spx\">" +
						  "      <img class=\"lazy\" data-original=\"%s\">" +
						  "    </div>" +
						  "    <div class=\"box-body\">%s</div>" +
						  "  </div>" +
						  "</div>"

				var elements = opts.data.map(element => {
					var body_options = [];

					console.log(element.title);

					if (element.title) {
						body_options.push("<h5>" + element.title + "</h5>");
					}

					if (element.subtitle) {
						body_options.push("<h6>" + element.subtitle + "</h6>");
					}

					return vsprintf(box, [
						element_width, element.id, box_options.join(""), 
						height, element.path, body_options.join("")
					]);
				});

				$(el).html("<div class=\"container\"></div>");
				$(el).append("<div class=\"jPages_bottom\"></div>");

				$("#" + el.id + " .jPages_bottom").append(
					"<div class=\"jPages_info\"></div>",
					"<div class=\"jPages_select\"></div>",
					"<div class=\"jPages_pagination\"></div>"
				);

				$("#" + el.id + " .jPages_select").append(
					"<label><select name=\"jPages_length\" class=\"form-control " +
					"input-sm\"></select> " + opts.options.selectLabel + "</label>"
				);

				for (var i = 4; i >= 1; i--) {
					var newPerPage = opts.options.perPage * i;

					if (i == 1) {
						$("#" + el.id + " select[name =\"jPages_length\"]").prepend(
							"<option value=\"" + newPerPage + "\" selected>" + 
							newPerPage + "</option>"
						); 
					} else {
						$("#" + el.id + " select[name =\"jPages_length\"]").prepend(
							"<option value=\"" + newPerPage + "\">" + 
							newPerPage + "</option>"
						); 
					}
				}

				create(el.id, opts, elements);

				$("#" + el.id + " .jPages_bottom select").change(function() {
					$("#" + el.id + " .jPages_pagination").jPages("destroy");
					opts.options.perPage = parseInt($(this).val());

					create(el.id, opts, elements);
				});
			},

			resize: function(width, height) {
				
			}
		};
	}
});

function create(id, opts, items) {
	var htmlWidgetsObj = HTMLWidgets.find("#" + id);

	if (typeof htmlWidgetsObj != "undefined") {
		$("#" + id + " .jPages_pagination").jPages({
			container: "#" + id + " .container",
			items: items,
			perPage: opts.options.perPage,
			first: false, last: false,
			previous: false, next: false,

			callback: function(pages, items) {
				$("#" + id + " .jPages_info").html(
					vsprintf(
						opts.options.infoLabel, [items.range.start, 
						items.range.end, items.count]
					)
				);

				$("#" + id + " .box-option div").each(function(index) {
					$(this).on("click", function() {
						if (HTMLWidgets.shinyMode) {
							var data_action = $(this).attr("data-action");

							var data_id = $(this).closest("div.box");
							var data_id = $(data_id).attr("data-id");

							Shiny.setInputValue(id + "_click_id", data_id);
							Shiny.setInputValue(id + "_click_value", data_action);
						}
					});
				});

				$("#" + id + " img.lazy").lazyload({effect: "fadeIn"});
			}
		});
	}
}
