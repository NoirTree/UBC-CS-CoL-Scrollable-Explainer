## D3 Scrollytelling Demo

This scrollable explainer shows the current financial struggle of UBC CS graduate students.

This project is a fork of [vlandham's scroll_demo](https://github.com/vlandham/scroll_demo) and the visualizations are created with [D3](https://d3js.org/) V4.

### Structure

- assets: external images.
- css: stylesheets. Mainly refer to [vlandham's scroll_demo](https://github.com/vlandham/scroll_demo) but have been changed a lot.
- data: datasets used in visualizations.
- js: javascripts.
  - scroller.js: handles the logic of scroller. We does not change anything from the [original version](https://github.com/vlandham/scroll_demo/blob/gh-pages/js/scroller.js).
  - sections.js: bridges the scroller and the content. This is where the majority of our work sits and contains all the visualizations used in the explainer.
- lib: d3v4 library.
- index.html: main page where the content of the explainer sits.

### How to run

To run it, you can open [this codesandbox](https://codesandbox.io/s/explainer-content-jvp3q5?file=/README.md) and directly see the result from the built-in browser.
