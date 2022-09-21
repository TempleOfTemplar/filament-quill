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
        <link href="{{ asset('quill.snow.css') }}" rel="stylesheet">
    @endonce
    @once
        <script src="{{ asset('quill.min.js') }}" type="text/javascript"></script>
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
