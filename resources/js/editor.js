import Quill from "quill/core/quill";
import ImageUploader from "quill-image-uploader";

document.addEventListener("alpine:init", () => {
    console.log("alpine:init");
    Alpine.data(
        "quill",
        ({state, statePath, placeholder, readOnly, tools, minHeight}) => ({
            instance: null,
            state: state,
            tools: tools,
            init() {
                console.log("quill:init");

            },
        })
    );
});


window.addEventListener('DOMContentLoaded', () => initTinymce())
$nextTick(() => initTinymce())
const initTinymce = () => {
    if (window.tinymce !== undefined && initialized === false) {
        tinymce.init({
            target: $refs.quill,
            language: '{{ $getInterfaceLanguage() }}',
            skin: typeof theme != 'undefined' ? theme : 'light',
            content_css: this.skin === 'dark' ? 'dark' : '',
            max_height: {{ $getHeight() }},
        menubar: {{ $getShowMenuBar() ? 'true' : 'false' }},
        plugins: ['{{ $getPlugins() }}'],
            toolbar: '{{ $getToolbar() }}',
            toolbar_mode: 'sliding',
            relative_urls : {{ $getRelativeUrls() ? 'true' : 'false' }},
        remove_script_host : {{ $getRemoveScriptHost() ? 'true' : 'false' }},
        convert_urls : {{ $getConvertUrls() ? 'true' : 'false' }},
        branding: false,
            images_upload_handler: (blobInfo, success, failure, progress) => {
            if (!blobInfo.blob()) return
            $wire.upload(`componentFileAttachments.{{ $getStatePath() }}`, blobInfo.blob(), () => {
                $wire.getComponentFileAttachmentUrl('{{ $getStatePath() }}').then((url) => {
                    if (!url) {
                        failure('{{ __('Error uploading file') }}')
                        return
                    }
                    success(url)
                })
            })
        },
            automatic_uploads: true,
            templates: {{ $getTemplate() }},
        setup: function(editor) {
            editor.on('blur', function(e) {
                state = editor.getContent()
            })
            editor.on('init', function(e) {
                if (state != null) {
                    editor.setContent(state)
                }
            })
            function putCursorToEnd() {
                editor.selection.select(editor.getBody(), true);
                editor.selection.collapse(false);
            }
            $watch('state', function(newstate) {
                if (newstate !== editor.getContent()) {
                    editor.resetContent(newstate || '');
                    putCursorToEnd();
                }
            });
        },
        {{ $getCustomConfigs() }}
    })
        initialized = true
    }