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
                Filament::registerStyles($this->getStyles());
                Filament::registerScripts($this->getScripts(), true);
            });
        }
    }

    protected function bootLoaders()
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'filament-quill');
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
