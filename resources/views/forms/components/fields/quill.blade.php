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

    <div class="filament-quill">
      <div
          wire:ignore
          class="quill-wrapper"
          x-data="quill({
                state: $wire.entangle('{{ $getStatePath() }}').defer,
                statePath: '{{ $getStatePath() }}',
                placeholder: '{{ $getPlaceholder() }}',
                readOnly: {{ $isDisabled() ? 'true' : 'false' }},
                tools: @js($getTools()),
                minHeight: @js($getMinHeight())
            })"
       >
      </div>
    </div>

</x-forms::field-wrapper>