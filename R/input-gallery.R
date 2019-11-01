#' @title Create an Image Gallery Widget
#'
#' @description Create an image gallery widget with pagination based on file or
#' URL paths to images.
#'
#' @param values File or URL paths to images that are to be displayed.
#' @param width The width of the input container, e.g., \code{'100\%'}; see
#' \link{validateCssUnit}.
#' @param height The height of each input image, e.g., \code{'200px'}; see
#' \link{validateCssUnit}.
#' @param options A list of initialization options.
#'
#' @return An image gallery widget that can be added to a UI definition.
#'
#' @importFrom utils modifyList
#' @importFrom shiny validateCssUnit icon
#' @importFrom htmltools div tags tagList tagAppendChild
#'
#' @export
gallery <- function(values, options = list(), width = NULL, height = NULL) {
  boxOptions <- tagList()

  if (!is.null(options[["detailsLabel"]])) {
    boxOptions <- tagAppendChild(
      boxOptions, tags$li(
        tags$a(
          href = "#info", icon("info-circle"),
          tags$span(options[["detailsLabel"]])
        )
      )
    )
  }

  if (!is.null(options[["addLabel"]])) {
    boxOptions <- tagAppendChild(
      boxOptions, tags$li(
        tags$a(
          href = "#plus", icon("plus-circle"),
          tags$span(options[["addLabel"]])
        )
      )
    )
  }

  if (length(boxOptions) > 0) boxOptions <- tags$ul(boxOptions)

  if (is.vector(values)) {
    values <- data.frame(
      id = 1:length(values), file_path = values, title = NA,
      subtitle = NA, stringsAsFactors = FALSE
    )
  }

  if (is.data.frame(values)) {
    if (!("title" %in% colnames(values))) values$title <- NA
    if (!("subtitle" %in% colnames(values))) values$subtitle <- NA
    if (!("id" %in% colnames(values))) values$id <- 1:nrow(values)
  }

  options <- modifyList(
    getOption("jPages.options", list()), options
  )

  if (is.null(options[["perRow"]])) options$perRow <- 4
  if (is.null(options[["perPage"]])) options$perPage <- 12

  images <- tagList(
    apply(
      values, 1, FUN = get_box, perRow = options$perRow,
      height = height, boxOptions = boxOptions
    )
  )

  data <- as.character(div(id = "item-container", images))

  htmlwidgets::createWidget(
    "gallery", list(data = data, options = options),
    width = width, height = height
  )
}

#' @importFrom shiny validateCssUnit
#' @importFrom htmltools div img tags
get_box <- function(row, perRow, boxOptions, height) {
  perRow <- as.integer(12 / perRow)

  div(
    class = paste0("col-sm-", perRow),
    div(
      class = "box", `data-id` = trimws(row["id"]),
      if (!is.null(boxOptions))
        div(class = "box-option", boxOptions),
      div(
        class = "box-image", style = if (!is.null(height))
          paste0("height: ", validateCssUnit(height), ";"),
        img(
          title = if (!is.na(row["title"])) row["title"],
          `data-original` = row["file_path"], class = "lazy"
        )
      ),
      div(
        class = "box-body",
        if (!is.na(row["title"])) tags$h5(row["title"]),
        if (!is.na(row["subtitle"])) tags$h6(row["subtitle"])
      )
    )
  )
}
