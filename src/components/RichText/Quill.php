<?php


namespace TempleOfTemplar\FilamentQuill;
use Filament\Forms\Components\Concerns\HasFileAttachments;
use Filament\Forms\Components\Concerns\HasPlaceholder;
use Filament\Forms\Components\Contracts\HasFileAttachments as HasFileAttachmentsContract;
use Filament\Forms\Components\Field;
use FilamentQuill\Forms\Components\Concerns\InteractsWithTools;

class Quill extends Field implements HasFileAttachmentsContract
{
    use HasFileAttachments;

    protected string $view = 'filament-quill::forms.components.fields.quill';

}
