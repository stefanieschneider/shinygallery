#' @title Create an Image Gallery
#'
#' @description Create an image gallery with pagination based on file or URL
#' paths to images.
#'
#' @param inputId The \code{input} slot that will be used to access the values.
#' @param values File or URL paths to images that are to be displayed.
#' @param height The height of each input image, e.g., \code{'200px'}; see
#' \link{validateCssUnit}.
#' @param options A list of initialization options.
#'
#' @return An image gallery control that can be added to a UI definition.
#'
#' @examples
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'   library(shiny)
#'   library(shinygallery)
#'
#'   get_uri <- function(file) {
#'     file_ext <- paste0("image/", tools::file_ext(file))
#'     base64enc::dataURI(file = file, mime = file_ext)
#'   }
#'
#'   file_path <- system.file("extdata", package = "shinygallery")
#'
#'   files <- list.files(file_path, full.names = TRUE)
#'   values <- rep(sapply(files, get_uri), 10)
#'
#'   ui <- fluidPage(
#'     gallery(
#'       "artworks", values = values,
#'       options = list(
#'         "detailsLabel" = "Details",
#'         "addLabel" = "Add"
#'       )
#'     )
#'   )
#'
#'   server <- function(input, output, session) {
#'     observeEvent(input$jPages_click, {
#'       print(input$jPages_click)
#'     })
#'   }
#'
#'   shinyApp(ui, server)
#' }
#'
#' @importFrom utils modifyList
#' @importFrom shiny validateCssUnit icon
#' @importFrom htmltools div tags attachDependencies htmlDependency
#' @importFrom htmltools tagList tagAppendChild tagAppendAttributes
#'
#' @export
gallery <- function(inputId, values, height = "200px", options = list()) {
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

  if (length(boxOptions) > 0) {
    boxOptions <- tags$ul(boxOptions)
  }

  if (is.vector(values)) {
    values <- data.frame(
      id = 1:length(values), file_path = values, title = NA,
      subtitle = NA, stringsAsFactors = FALSE
    )
  }

  if (is.data.frame(values)) {
    if (!("id" %in% colnames(values))) {
      values$id <- 1:nrow(values)
    }

    if (!("title" %in% colnames(values))) {
      values$title <- NA
    }

    if (!("subtitle" %in% colnames(values))) {
      values$subtitle <- NA
    }
  }

  options <- modifyList(
    getOption("jPages.options", list()),
    if (is.function(options)) options() else options
  )

  if (is.null(options[["perRow"]])) options$perRow <- 4
  if (is.null(options[["perPage"]])) options$perPage <- 12

  options$class <- "shiny-input-container input-gallery"
  options$id <- inputId; options$style <- "width: 100%;"

  images <- tagList(
    apply(
      values, 1, FUN = get_box, perRow = options$perRow,
      height = height, boxOptions = boxOptions
    )
  )

  div_container <- div(div(id = "item-container", images))
  div_container$attribs <- options

  attachDependencies(
    div_container, htmlDependency(
      name = "jPages", version = "0.7",
      package = "shinygallery", src = "assets",
      script = c(
        "js/jPages.js", "js/jPages-bindings.js",
        "js/lazyload.js", "js/sprintf.js"
      ),
      stylesheet = "css/style.css"
    ), append = TRUE
  )
}

#' @importFrom shiny validateCssUnit
#' @importFrom htmltools div img tags
get_box <- function(row, perRow, height, boxOptions) {
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
