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
        <link href="{{ asset('resources/dist/css/quill.snow.css') }}" rel="stylesheet">
    @endonce
    @once
        <script src="{{ asset('resources/dist/js/quill.min.js') }}" type="text/javascript"></script>
    @endonce
    <div
            x-data="quilleditor({
            state: $wire.{{ $applyStateBindingModifiers('entangle(\'' . $getStatePath() . '\')') }},
        })"
    >
        <div
                wire:ignore
                class="w-full border"
                x-ref="quillEditorField"
                style="min-height: 150px;"
        ></div>
    </div>


</x-forms::field-wrapper>
