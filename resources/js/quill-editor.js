import Quill from "quill/core/quill";
import Snow from 'quill/themes/snow'
import Toolbar from 'quill/modules/toolbar'
import Bold from 'quill/formats/bold'
import Italic from 'quill/formats/italic'
import Header from 'quill/formats/header'
import Underline from 'quill/formats/underline'
import ListItem from 'quill/formats/list'
import Strike from 'quill/formats/strike'
import Blockquote from 'quill/formats/blockquote'
import CodeBlock from 'quill/formats/code'
import Script from 'quill/formats/script'
import Image from 'quill/formats/image'
import Link from 'quill/formats/link'

Quill.register({
    'modules/toolbar': Toolbar,
    'themes/snow': Snow,
    'formats/bold': Bold,
    'formats/italic': Italic,
    'formats/header': Header,
    'formats/underline': Underline,
    'formats/list': ListItem,
    'formats/strike' : Strike,
    'formats/blockquote' : Blockquote,
    'formats/codeblock' : CodeBlock,
    'formats/script' : Script,
    'formats/image' : Image,
    'formats/link' : Link,
});

Quill.register('modules/imageUploader', ImageUploader);


document.addEventListener('alpine:init', () => {
    Alpine.data('quilleditor', ({
                                             state,
                                         }) => {

        return {
            state,
            init: function () {
                this.render();
            },
            render() {
                window.addEventListener('DOMContentLoaded', () => initQuill())
                $nextTick(() => initQuill())
                const initQuill = () => {
                    this.editor = null

                    this.editor = new Quill(this.$el, {
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
});