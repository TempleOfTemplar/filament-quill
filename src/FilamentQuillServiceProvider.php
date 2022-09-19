<?php

namespace FilamentQuill;

use Filament\PluginServiceProvider;

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
            'filament-quill.js' => __DIR__ . '/../dist/filament-quill.js',
        ];
    }

    public function getStyles(): array
    {
        return [
            'filament-quill.css' => __DIR__ . '/../dist/filament-quill.css',
        ];
    }

}
