<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;


class FilamentQuillServiceProvider extends PluginServiceProvider
{

    public static string $name = 'filament-quill';

    protected array $beforeCoreScripts = [
        'filament-quill' => __DIR__.'/../resources/dist/js/index.js',
    ];

    protected array $styles = [
        'filament-quill' => __DIR__ . '/../resources/dist/css/quill.snow.css',
    ];
}
