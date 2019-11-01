#' Helper Functions for Using Shinygallery in Shiny
#'
#' These functions are like most \code{fooOutput()} and \code{renderFoo()}
#' functions in the \pkg{shiny} package. The former is used to create a
#' container for a gallery, and the latter is used in the server logic to
#' render the gallery.
#'
#' @param outputId The \code{output} slot that will be used to access the
#' values.
#' @param width The width of the input container, e.g., \code{'100\%'}; see
#' \link{validateCssUnit}.
#' @param height The height of each input image, e.g., \code{'200px'}; see
#' \link{validateCssUnit}.
#'
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
#'   ui <- fluidPage(galleryOutput("gallery"))
#'
#'   server <- function(input, output, session) {
#'     output$gallery <- renderGallery({
#'       gallery(values, height = 150, options = list(
#'         "detailsLabel" = "Details", "addLabel" = "Add"
#'       ))
#'     })
#'   }
#'
#'   shinyApp(ui, server)
#' }
#'
#' @importFrom htmlwidgets shinyWidgetOutput
#' @export
galleryOutput <- function(outputId, width = "100%", height = "150px") {
  shinyWidgetOutput(
    outputId, "gallery", width, height, package = "shinygallery"
  )
}

#' @param expr An expression to create an image gallery widget (normally via
#' \code{gallery()}), or a data object to be passed to \code{gallery()} to
#' create an image gallery widget.
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#' is useful if you want to save an expression in a variable.
#'
#' @importFrom htmlwidgets shinyRenderWidget
#'
#' @rdname galleryOutput
#' @export
renderGallery <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) expr <- substitute(expr) # force quoted
  shinyRenderWidget(expr, galleryOutput, env, quoted = TRUE)
}
