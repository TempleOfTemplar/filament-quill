<?php

namespace FilamentQuill;

use Filament\Facades\Filament;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentQuillServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('filament-quill')
            ->hasViews()
            ->hasAssets();
    }

    public function packageBooted()
    {
        if (class_exists(\Filament\FilamentServiceProvider::class)) {
            Filament::serving(function () {
                Filament::registerScripts($this->getScripts(), true);
                Filament::registerStyles($this->getStyles());
            });
        }
    }

    public function getScripts(): array
    {
        return [
            'filament-quill' => __DIR__ . '/../resources/dist/js/editor.js',
        ];
    }

    public function getStyles(): array
    {
        return [
            'filament-quill-core' => __DIR__ . '/../resources/dist/css/quill.core.css',
            'filament-quill-snow' => __DIR__ . '/../resources/dist/css/quill.snow.css',
        ];
    }
}
