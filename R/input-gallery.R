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
#'
#' @export
gallery <- function(values, options = list(), width = NULL, height = NULL) {
  if (is.vector(values)) {
    values <- data.frame(
      id = 1:length(values), path = values, title = NA,
      subtitle = NA, stringsAsFactors = FALSE
    )
  }

  if (is.data.frame(values)) {
    if (!("title" %in% colnames(values))) values$title <- NA
    if (!("subtitle" %in% colnames(values))) values$subtitle <- NA
    if (!("id" %in% colnames(values))) values$id <- 1:nrow(values)

    values <- lapply(split(values, 1:nrow(values)), unlist)
  }

  options <- modifyList(
    getOption("jPages.options", list()), options
  )

  if (is.null(options[["perRow"]])) options$perRow <- 4
  if (is.null(options[["perPage"]])) options$perPage <- 12

  dependencies <- list(
    rmarkdown::html_dependency_jquery(),
    rmarkdown::html_dependency_bootstrap("default")
  )

  htmlwidgets::createWidget(
    "gallery", list(data = unname(values), options = options),
    width = width, height = height, dependencies = dependencies
  )
}
