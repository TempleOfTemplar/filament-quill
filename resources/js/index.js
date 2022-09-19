import QuillEditorComponent from './components/quill-editor';

if(!window.Alpine) {
    document.addEventListener('alpine:init', () => {
        console.log("alpine:init");
        window.Alpine.plugin(QuillEditorComponent);
    })
} else {
    window.Alpine.plugin(QuillEditorComponent);
}
