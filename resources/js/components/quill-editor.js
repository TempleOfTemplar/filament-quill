import Quill from "quill/core/quill";
import '../../dist/css/quill.core.css';
import '../../dist/css/quill.snow.css';

export default (Alpine) => {
    Alpine.data('quillEditorComponent', ({
                                             state,
                                         }) => {

        return {
            state,
            init: function () {
                this.render();
            },
            render() {
                window.addEventListener('DOMContentLoaded', () => initQuill())
                const initQuill = () => {
                    console.log("RENDER");
                    this.editor = null
                    this.editor = new Quill(this.$refs.quill, {
                        theme: null,
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
                    this.editor.setContents(this.state);
                    this.editor.on('editor-change', function (eventName, ...args) {
                        if (eventName === 'text-change') {
                            // args[0] will be delta
                            console.log('args', args);
                            // this.state = args[0];
                        } else if (eventName === 'selection-change') {
                            // args[0] will be old range
                        }
                    });
                }
            },
        }
    });
}