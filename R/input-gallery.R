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

  options <- modifyList(
    getOption("jPages.options", list()), options
  )

  if (is.data.frame(values)) {
    if (!("title" %in% colnames(values))) values$title <- NA
    if (!("subtitle" %in% colnames(values))) values$subtitle <- NA
    if (!("id" %in% colnames(values))) values$id <- 1:nrow(values)

    if (!is.null(options$limits) & length(options$limits) == 2) {
      options$numberObjects <- nrow(values)
      values <- values[options$limits[1]:options$limits[2], ]
    }

    if (is.list(values$title))
     values$title <- unlist(lapply(values$title, `[[`, 1))

    if (is.list(values$subtitle))
      values$subtitle <- unlist(lapply(values$subtitle, `[[`, 1))

    if (!is.null(options$titleLabel))
      values$title[is.na(values$title)] <- options$titleLabel

    if (!is.null(options$subtitleLabel))
      values$subtitle[is.na(values$subtitle)] <- options$subtitleLabel

    values <- values[, c("id", "path", "title", "subtitle")]
    values <- split(values, 1:nrow(values))
  }

  if (is.null(options$perRow)) options$perRow <- 4
  if (is.null(options$perPage)) options$perPage <- 12
  if (is.null(options$startPage)) options$startPage <- 1

  dependencies <- list(
    rmarkdown::html_dependency_jquery(),
    rmarkdown::html_dependency_bootstrap("default")
  )

  htmlwidgets::createWidget(
    "gallery", list(data = unname(values), options = options),
    width = width, height = height, dependencies = dependencies
  )
}
