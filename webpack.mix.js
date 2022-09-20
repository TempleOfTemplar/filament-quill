let mix = require("laravel-mix");

mix.js("resources/js/filament-quill.js", "resources/dist/js").postCss(
    "resources/css/editor.css",
    "resources/dist/css"
);
