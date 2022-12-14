<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;


class FilamentQuillServiceProvider extends PluginServiceProvider
{

    public static string $name = 'filament-quill';

    protected array $beforeCoreScripts = [
        'quill.min' => __DIR__.'/../resources/dist/js/quill.min.js',
        'filament-quill' => __DIR__.'/../resources/dist/js/filament-quill.js',
    ];

    protected array $styles = [
        'quill.snow' => __DIR__ . '/../resources/dist/css/quill.snow.css',
    ];
}
