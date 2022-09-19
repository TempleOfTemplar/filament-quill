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
                x-data="{ state: $wire.entangle('{{ $getStatePath() }}'), initialized: false }"
                x-init="(() => {
                window.addEventListener('DOMContentLoaded', () => initQuill());
                const initQuill = ()=>{

                                var quill = new Quill(this.$quill, {
                    theme: 'snow',
                    modules: {
                        imageUploader: {
                            upload: (file) => {
                                return new Promise((resolve) => {
                                    this.$wire.upload(
                                        `componentFileAttachments.${statePath}`,
                                        file,
                                        (uploadedFilename) => {
                                            this.$wire
                                                .getComponentFileAttachmentUrl(statePath)
                                                .then((url) => {
                                                    if (!url) {
                                                        return resolve({
                                                            success: 0,
                                                        });
                                                    }
                                                    return resolve({
                                                        success: 1,
                                                        file: {
                                                            url: url,
                                                        },
                                                    });
                                                });
                                        }
                                    );
                                });
                            },
                        },
                    },
                });
                Quill.register('modules/imageUploader', ImageUploader);
        quill.setContents(this.state);
        this.instance = quill;
        quill.on('editor-change', function (eventName, ...args) {
        if (eventName === 'text-change') {
        // args[0] will be delta
        console.log('args', args);
        this.state = args[0];
        } else if (eventName === 'selection-change') {
        // args[0] will be old range
        }
        });

                }
                }
            })()"
                x-cloak
                wire:ignore
        >
            @unless($isDisabled())
                <input
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