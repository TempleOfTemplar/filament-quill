<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;


class FilamentQuillServiceProvider extends PluginServiceProvider
{

    public static string $name = 'filament-quill';

    protected array $beforeCoreScripts = [
        'filament-tools' => __DIR__.'/../resources/js/quill-editor.js',
    ];
}
