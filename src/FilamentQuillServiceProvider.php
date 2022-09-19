<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;

class FilamentQuillServiceProvider extends PluginServiceProvider
{
    public static string $name = 'filament-quill';

    protected array $beforeCoreScripts = [
        'filament-quill.js' => __DIR__ . '/../dist/filament-quill.js',
    ];

    protected array $styles = [
        'quill.core.css' => __DIR__ . '/../resources/dist/css/quill.core.css',
        'quill.snow.css' => __DIR__ . '/../resources/dist/css/quill.snow.css',
    ];
}
