<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;

class FilamentQuillServiceProvider extends PluginServiceProvider
{
    public static string $name = 'filament-quill';

    protected array $beforeCoreScripts = [
        'filament-quill' => __DIR__ . '/../dist/filament-quill.js',
    ];

    protected array $styles = [
        'filament-quill-styles-1' => __DIR__ . '/../resources/dist/css/quill.core.css',
        'filament-quill-styles-2' => __DIR__ . '/../resources/dist/css/quill.snow.css',
    ];
}
