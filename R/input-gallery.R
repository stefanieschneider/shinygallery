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

    if ("id" %in% colnames(values)) values$resourceid <- values$id
    else values$resourceid <- 1:nrow(values)

    values$id <- 1:nrow(values) # overwrite for correct indexing

    if (!is.null(options$limits) & length(options$limits) == 2) {
      options$numberObjects <- nrow(values) # total number
      values <- values[options$limits[1]:options$limits[2], ]

      if (max(options$limits) < nrow(values)) {
        # options$limits <- c(min(options$limits), nrow(values))
      }
    }

    if (is.list(values$title))
     values$title <- unlist(lapply(values$title, `[[`, 1))

    if (is.list(values$subtitle))
      values$subtitle <- unlist(lapply(values$subtitle, `[[`, 1))

    values$title <- trimws(values$title)
    values$subtitle <- trimws(values$subtitle)

    if (!is.null(options$titleLabel)) {
      replace <- is.na(values$title) | nchar(values$title) == 0
      values$title[replace] <- options$titleLabel
    }

    if (!is.null(options$subtitleLabel)) {
      replace <- is.na(values$subtitle) | nchar(values$subtitle) == 0
      values$subtitle[replace] <- options$subtitleLabel
    }

    values <- values[, c("id", "resourceid", "path", "title", "subtitle")]
    values <- split(values, 1:nrow(values))
  }

  if (is.null(options$perRow)) options$perRow <- 4
  if (is.null(options$perPage)) options$perPage <- 12
  if (is.null(options$startPage)) options$startPage <- 1

  if (is.null(options$loading)) options$loading <- FALSE
  if (is.null(options$draggable)) options$draggable <- FALSE

  dependencies <- list(
    rmarkdown::html_dependency_jquery(),
    rmarkdown::html_dependency_bootstrap("default")
  )

  htmlwidgets::createWidget(
    "gallery", list(data = unname(values), options = options),
    width = width, height = height, dependencies = dependencies
  )
}
