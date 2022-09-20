// import Snow from 'quill/themes/snow'
// import Bold from 'quill/formats/bold'
// import Italic from 'quill/formats/italic'
// import Header from 'quill/formats/header'
// import Underline from 'quill/formats/underline'
// import ListItem from 'quill/formats/list'
// import Strike from 'quill/formats/strike'
// import Blockquote from 'quill/formats/blockquote'
// import CodeBlock from 'quill/formats/code'
// import Script from 'quill/formats/script'
// import Image from 'quill/formats/image'
// import Link from 'quill/formats/link'
import Quill from "quill/core";
import Toolbar from 'quill/modules/toolbar';
import Snow from 'quill/themes/snow';

import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Header from 'quill/formats/header';

Quill.register({
    'modules/toolbar': Toolbar,
    'themes/snow': Snow,
    'formats/bold': Bold,
    'formats/italic': Italic,
    'formats/header': Header,
    // 'formats/underline': Underline,
    // 'formats/list': ListItem,
    // 'formats/strike': Strike,
    // 'formats/blockquote': Blockquote,
    // 'formats/codeblock': CodeBlock,
    // 'formats/script': Script,
    // 'formats/image': Image,
    // 'formats/link': Link,
});

// Quill.register('modules/imageUploader', ImageUploader);


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
                        theme: null,
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