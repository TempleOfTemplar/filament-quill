<x-forms::field-wrapper
        :id="$getId()"
        :label="$getLabel()"
        :label-sr-only="$isLabelHidden()"
        :helper-text="$getHelperText()"
        :hint="$getHint()"
        :hint-icon="$getHintIcon()"
        :required="$isRequired()"
        :state-path="$getStatePath()"
>
    @once
        <link href="{{ asset('dist/filament-quill.css') }}" rel="stylesheet">
    @endonce
    <div class="filament-quill">
        <div
                wire:ignore
                x-data="quillEditorComponent({
                state: $wire.entangle('{{ $getStatePath() }}').defer,
                statePath: '{{ $getStatePath() }}',
                placeholder: '{{ $getPlaceholder() }}',
                readOnly: {{ $isDisabled() ? 'true' : 'false' }},
                tools: @js($getTools()),
                minHeight: @js($getMinHeight())
            })"
        >
            @unless($isDisabled())
                <div
                        wire:ignore
                        id="quill-editor-{{ $getId() }}"
                        type="hidden"
                        x-ref="quill"
                >
            @else
                <div
                        x-html="state"
                        class="prose dark:prose-invert block w-full max-w-none rounded-lg border border-gray-300 bg-white p-3 opacity-70 shadow-sm transition duration-75 dark:border-gray-600 dark:bg-gray-700"
                ></div>
            @endunless
        </div>
    </div>


</x-forms::field-wrapper>
