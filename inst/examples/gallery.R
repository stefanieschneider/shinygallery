if (interactive()) {
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
    observe({
      req(input$gallery_click_id)
      req(input$gallery_click_value)

      print(input$gallery_click_id)
      print(input$gallery_click_value)
    })

    observeEvent(input$gallery_page_id, {
      print(input$gallery_page_id)
    })

    observeEvent(input$gallery_page_range, {
      print(input$gallery_page_range)
    })

    output$gallery <- renderGallery({
      gallery(values, height = 150, options = list(
        "detailsLabel" = "Details", "addLabel" = "Add",
        "titleLabel" = "Title", "subtitleLabel" = "Subtitle"
      ))
    })
  }

  shinyApp(ui, server)
}
