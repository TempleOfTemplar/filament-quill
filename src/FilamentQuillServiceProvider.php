<?php

namespace TempleOfTemplar\FilamentQuill;

use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentQuillServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package
            ->name('filament-quill')
            ->hasConfigFile()
            ->hasViews();
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
            'filament-quill-core' => __DIR__ . '/../resources/dist/js/quill.js',
            'filament-quill-field' => __DIR__ . '/../resources/js/quill-editor.js',
        ];
    }

    public function getStyles(): array
    {
        return [
            'quill.snow' => __DIR__ . '/../resources/dist/css/quill.snow.css',
        ];
    }
}
