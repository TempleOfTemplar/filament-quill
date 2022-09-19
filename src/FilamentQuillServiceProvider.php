<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;

class FilamentQuillServiceProvider extends PluginServiceProvider
{
    public static string $name = 'filament-quill';


    protected array $styles = [
        'quill.css' => __DIR__ . '/../dist/filament-quill.css',
    ];

    protected array $beforeCoreScripts = [
        'filament-quill.js' => __DIR__ . '/../dist/filament-quill.js',
    ];

}
