library(shiny)
library(shinygallery)

get_uri <- function(file) {
  file_ext <- paste0("image/", tools::file_ext(file))
  base64enc::dataURI(file = file, mime = file_ext)
}

file_path <- system.file("extdata", package = "shinygallery")

files <- list.files(file_path, full.names = TRUE)
values <- rep(sapply(files, get_uri), 10)

ui <- fluidPage(
  gallery(
    "artworks", values = values,
    options = list(
      "detailsLabel" = "Details",
      "addLabel" = "Add"
    )
  )
)

server <- function(input, output, session) {
  observeEvent(input$jPages_click, {
    print(input$jPages_click)
  })
}

shinyApp(ui, server)
