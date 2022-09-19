<?php

namespace FilamentQuill;

use Filament\Facades\Filament;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentQuillServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-quill';

    protected array $beforeCoreScripts = [
        'filament-quill' => __DIR__ . '/../dist/js/quill.min.js',
    ];
}
