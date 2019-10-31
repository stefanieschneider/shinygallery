$.fn.newjPages = function(perPage, infoLabel) {
  this.jPages({
    containerID: "item-container",
    perPage: perPage,
    first: false,
    last: false,
    previous: false,
    next: false,
    callback: function(pages, items) {
      $(".jPages_info").html(
        vsprintf(
          infoLabel, [items.range.start, 
          items.range.end, items.count]
        )
      );

      $("img.lazy").lazyload({effect: "fadeIn"});
    }
  });
};

var jPagesInputBinding = new Shiny.InputBinding();

$.extend(jPagesInputBinding, {
  find: function(scope) {
    return $(scope).find(".input-gallery");
  },
  initialize: function(el) {
    var perPage = parseInt($(el).attr("perpage"));
    var selectLabel = $(el).attr("selectlabel");
    var infoLabel = $(el).attr("infolabel");

    if (selectLabel == null) {
      selectLabel = "records per page";
    }

    if (infoLabel == null) {
      infoLabel = "%s to %s of %s entries";
    }

    $("img.lazy").lazyload({effect: "fadeIn"});

    $(el).append(
      "<div class=\"jPages_bottom\"></div>"
    );

    $(".jPages_bottom").append(
      "<div class=\"jPages_info\"></div>",
      "<div class=\"jPages_select\"></div>",
      "<div class=\"jPages_pagination\"></div>"
    );

    $(".jPages_select").append(
      "<label><select name=\"jPages_length\" class=\"form-control " +
      "input-sm\"></select> " + selectLabel + "</label>"
    );

    for (var i = 4; i >= 1; i--) {
      var newPerPage = perPage * i;

      if (i == 1) {
        $("select[name =\"jPages_length\"]").prepend(
          "<option value=\"" + newPerPage + "\" selected>" + 
          newPerPage + "</option>"
        ); 
      } else {
        $("select[name =\"jPages_length\"]").prepend(
          "<option value=\"" + newPerPage + "\">" + 
          newPerPage + "</option>"
        ); 
      }
    }

    $(".jPages_pagination").newjPages(perPage, infoLabel);

    $(".jPages_bottom select").change(function() {
      var newPerPage = parseInt($(this).val());

      $(".jPages_pagination").jPages("destroy");
      $(".jPages_pagination").newjPages(newPerPage, infoLabel);
    });

    $(".box a").each(function(index) {
      $(this).on("click", function() {
        var href = $(this).attr("href").replace("#", "");
        var parent = $(this).closest("div.box");

        var values = [$(parent).attr("data-id"), href];
        Shiny.setInputValue("jPages_click", values);
      });
    });
  },
  getId: function(el) {
    return $(el).attr('id');
  },
  getValue: function(el) {
    return null;
  },
  setValue: function(el, values) {
    return null;
  },
  subscribe: function(el, callback) {
    $(el).on("change.jPagesInputBinding", function(e) {
      callback(false);
    });
  },
  unsubscribe: function(el) {
    $(el).off(".jPagesInputBinding");
  },
  receiveMessage: function(el, data) {
    $(el).trigger('change');
  },
});

Shiny.inputBindings.register(jPagesInputBinding);
