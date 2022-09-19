<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;

class FilamentQuillServiceProvider extends PluginServiceProvider
{
    public static string $name = 'filament-quill';

    protected array $beforeCoreScripts = [
        'filament-quill' => __DIR__ . '/../dist/filament-quill.js',
    ];
}
