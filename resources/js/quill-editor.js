import Quill from "./quill-exported";

export default (Alpine) => {
    Alpine.data('quilleditor', ({state, statePath, placeholder, readOnly, id, tools, minHeight}) => ({
            instance: null,
            state: state,
            tools: tools,
            init() {
                window.addEventListener('DOMContentLoaded', () => {
                    console.log(this.$refs.quillEditorField);
                    console.log(this.$el);
                    window.Quill = Quill;
                    this.instance = new Quill(this.$refs.quillEditorField, {
                        theme: 'show',
                        modules: {
                            // imageUploader: {
                            //     upload: (file) => {
                            //         return new Promise((resolve) => {
                            //             this.$wire.upload(
                            //                 `componentFileAttachments.${statePath}`,
                            //                 file,
                            //                 (uploadedFilename) => {
                            //                     this.$wire
                            //                         .getComponentFileAttachmentUrl(statePath)
                            //                         .then((url) => {
                            //                             if (!url) {
                            //                                 return resolve({
                            //                                     success: 0,
                            //                                 });
                            //                             }
                            //                             return resolve({
                            //                                 success: 1,
                            //                                 file: {
                            //                                     url: url,
                            //                                 },
                            //                             });
                            //                         });
                            //                 }
                            //             );
                            //         });
                            //     },
                            // },
                        },
                    });
                    // this.editor.setContents(this.state);
                    // this.editor.on('editor-change', function (eventName, ...args) {
                    //     if (eventName === 'text-change') {
                    //         // args[0] will be delta
                    //         console.log('args', args);
                    //         // this.state = args[0];
                    //     } else if (eventName === 'selection-change') {
                    //         // args[0] will be old range
                    //     }
                    // });
                });
                // $nextTick(() => initQuill())
                // const initQuill = () => {

                // }
            }
        })
    )
}