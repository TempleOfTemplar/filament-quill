import Quill from "quill/core/quill";

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
                this.editor = null
                this.editor = new Quill(this.$refs.quill, {
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
                        // this.state = args[0];
                    } else if (eventName === 'selection-change') {
                        // args[0] will be old range
                    }
                });
            },
        }
    });
}