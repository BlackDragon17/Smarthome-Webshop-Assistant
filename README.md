# Smarthome Webshop Assistant

*A webshop-like assistant for choosing compatible smart home products.*

**SHWA** constitutes the practical part of my bachelor’s thesis. Built upon Vue, Bootstrap, and standard web technologies, it is my first real venture into web development.

The developed website will indefinitely be hosted on GitHub Pages under https://blackdragon17.github.io/Smarthome-Webshop-Assistant/

### Repository structure

This repository follows the standard Vite or Vue CLI pattern.

```
root
  ├─.github/workflows          GitHub Actions workflow configuration
  ├─.vscode                    Recommended extensions for VS Code
  ├─public                     Files to be copied to the webserver root unchanged
  ├─resources
  │  ├─scripts                 For dealing with product JSONs and GitHub Pages deployment
  │  └─products                Product JSONs, human-readable
  │    └─packed                Product JSONs, compressed
  ├─src
  │  ├─assets                  Various assets to be shipped with the webapp
  │  ├─components              Vue components
  │  ├─App.vue                 Webapp root
  │  ├─EventBus.js             Global event bus
  │  └─main.js                 Webapp entry point
  ├─index.html                 The main HTML file hosting the Vue webapp
  ├─package-lock.json          Auto-generated list of all project dependencies (ensures same package versions)
  ├─package.json               Direct project dependencies
  └─vite.config.js             Vite build configuration
```
