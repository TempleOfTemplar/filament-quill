import QuillEditorComponent from './components/quill-editor';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(QuillEditorComponent);
})