HTMLWidgets.widget({
	name: "gallery",
	type: "output",

	factory: function(el, width, height) {
		// TODO: define shared variables for this instance
	
		return {
			renderValue: function(x) {
				if (x.options.selectLabel == null) {
					x.options.selectLabel = "records per page";
				}

				if (x.options.infoLabel == null) {
					x.options.infoLabel = "%s to %s of %s entries";
				}

				$(el).html(x.data.replace("item-", el.id + "-"));

				$("#" + el.id + " img.lazy").lazyload({
					effect: "fadeIn"
				});

				$(el).append(
					"<div class=\"jPages_bottom\"></div>"
				);

				$("#" + el.id + " .jPages_bottom").append(
					"<div class=\"jPages_info\"></div>",
					"<div class=\"jPages_select\"></div>",
					"<div class=\"jPages_pagination\"></div>"
				);

				$("#" + el.id + " .jPages_select").append(
					"<label><select name=\"jPages_length\" class=\"form-control " +
					"input-sm\"></select> " + x.options.selectLabel + "</label>"
				);

				for (var i = 4; i >= 1; i--) {
					var newPerPage = x.options.perPage * i;

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

				create(el.id, x);

				$("#" + el.id + " .jPages_bottom select").change(function() {
					$("#" + el.id + " .jPages_pagination").jPages("destroy");
					x.options.perPage = parseInt($(this).val());

					create(el.id, x);
				});

				$("#" + el.id + " .box a").each(function(index) {
					$(this).on("click", function() {
						var href = $(this).attr("href").replace("#", "");
						var parent = $(this).closest("div.box");

						var values = [$(parent).attr("data-id"), href];

						if (HTMLWidgets.shinyMode) {
							Shiny.setInputValue(el.id + "_click", values);
						}
					});
				});
			},

			resize: function(width, height) {
				// TODO: code to re-render the widget with a new size
			}
		};
	}
});

function create(id, x) {
	var htmlWidgetsObj = HTMLWidgets.find("#" + id);

	if (typeof htmlWidgetsObj != "undefined") {
		$("#" + id + " .jPages_pagination").jPages({
			containerID: id + "-container",
			perPage: x.options.perPage,
			first: false,
			last: false,
			previous: false,
			next: false,
			callback: function(pages, items) {
				$("#" + id + " .jPages_info").html(
					vsprintf(
						x.options.infoLabel, [items.range.start, 
						items.range.end, items.count]
					)
				);

				$("#" + id + " img.lazy").lazyload({
					effect: "fadeIn"
				});
			}
		});
	}
}
