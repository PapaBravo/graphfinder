# graphfinder

A static graph explorer built with vanilla JavaScript, LoraDB WASM, and Cytoscape.js.

## Features

- Runs a seeded LoraDB graph database entirely in the browser
- Accepts arbitrary Cypher queries from a textarea UI
- Renders returned nodes and relationships with Cytoscape.js
- Generates the example dataset snapshot at build time
- Publishes the built static site to GitHub Pages with GitHub Actions

## Local development

This project requires Node.js 20+.

```bash
npm install
npm run dev
```

The example snapshot is regenerated automatically before `dev` and `build`.

## Build

```bash
npm run build
```

The production files are written to `/tmp/workspace/PapaBravo/graphfinder/dist`.

## Example dataset

The source dataset lives in `/tmp/workspace/PapaBravo/graphfinder/data/seed.cypher`.
During `npm run generate:data`, it is loaded into the vendored LoraDB WASM runtime and exported to `/tmp/workspace/PapaBravo/graphfinder/public/data/example.lorasnap`.

## Deployment

The workflow at `/tmp/workspace/PapaBravo/graphfinder/.github/workflows/deploy-pages.yml` installs dependencies, rebuilds the example snapshot, builds the app, and deploys the static output to GitHub Pages.

## Vendored runtime

This repository vendors the LoraDB WASM browser and Node bindings for version `0.15.0` under `/tmp/workspace/PapaBravo/graphfinder/vendor/loradb-wasm` because the published npm package omits the runtime `pkg-node` and `pkg-web` artifacts needed by this app.
