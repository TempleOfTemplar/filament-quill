// import QuillEditorComponent from './quill-editor';
//
// if(!window.Alpine) {
//     document.addEventListener('alpine:init', () => {
//         console.log("alpine:init");
//         window.Alpine.plugin(QuillEditorComponent);
//     })
// } else {
//     window.Alpine.plugin(QuillEditorComponent);
// }
import CodeEditorAlpinePlugin from './quill-editor';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(CodeEditorAlpinePlugin);
})