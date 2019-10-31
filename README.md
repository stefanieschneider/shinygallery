
<!-- README.md is generated from README.Rmd. Please edit that file -->

# shinygallery <img src="man/figures/example.png" align="right" width="225" />

[![Lifecycle](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://www.tidyverse.org/lifecycle/#experimental)
[![Travis CI build
status](https://travis-ci.org/stefanieschneider/shinygallery.svg?branch=master)](https://travis-ci.org/stefanieschneider/shinygallery)
[![AppVeyor build
status](https://ci.appveyor.com/api/projects/status/github/stefanieschneider/shinygallery?branch=master&svg=true)](https://ci.appveyor.com/project/stefanieschneider/shinygallery)

## Overview

This R package creates image gallery controls with pagination to show
images based on file or URL paths. shinygallery is built on top of
[jPages](https://github.com/luis-almeida/jPages) and
[Bootstrap](https://getbootstrap.com/).

## Installation

You can install the development version of shinygallery from
[GitHub](https://github.com/stefanieschneider/shinygallery):

``` r
# install.packages("devtools")
devtools::install_github("stefanieschneider/shinygallery")
```

## Usage

``` r
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
}
```

## Contributing

Please report issues, feature requests, and questions to the [GitHub
issue
tracker](https://github.com/stefanieschneider/shinygallery/issues). We
have a [Contributor Code of
Conduct](https://github.com/stefanieschneider/shinygallery/blob/master/CODE_OF_CONDUCT.md).
By participating in shinygallery you agree to abide by its terms.
