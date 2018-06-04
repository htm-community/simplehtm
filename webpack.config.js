"use strict";
let path = require("path")
let fs = require("fs")

let pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
)
let version = pkg.version
let mode = 'development'

let modules = []

// Simple HTM bundle.
modules.push({
    mode: mode,
    entry: [
        "./src/index.js",
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    },
    output: {
        path: __dirname + "/docs/",
        filename: `simplehtm-${version}.js`
    }
})

module.exports = modules
