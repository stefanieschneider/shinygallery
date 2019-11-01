library(shiny)
library(shinygallery)

get_uri <- function(file) {
  file_ext <- paste0("image/", tools::file_ext(file))
  base64enc::dataURI(file = file, mime = file_ext)
}

file_path <- system.file("extdata", package = "shinygallery")

files <- list.files(file_path, full.names = TRUE)
values <- rep(sapply(files, get_uri), 10)

ui <- fluidPage(galleryOutput("gallery"))

server <- function(input, output, session) {
  observeEvent(input$gallery_click, {
    print(input$gallery_click)
  })

  output$gallery <- renderGallery({
    gallery(values, height = 150, options = list(
      "detailsLabel" = "Details", "addLabel" = "Add"
    ))
  })
}

shinyApp(ui, server)
