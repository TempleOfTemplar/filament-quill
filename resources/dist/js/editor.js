document.addEventListener("alpine:init", () => {
    Alpine.data(
        "quill",
        ({ state, statePath, placeholder, readOnly, tools, minHeight }) => ({
            instance: null,
            state: state,
            tools: tools,
            init() {
                this.instance = new EditorJS({
                    holder: this.$el,
                    minHeight: minHeight,
                    data: this.state,
                    placeholder: placeholder,
                    readOnly: readOnly,
                    tools: enabledTools,

                    onChange: () => {
                        this.instance.save().then((outputData) => {
                            this.state = outputData;
                        });
                    },
                    onReady: () => {
                        new DragDrop(this.instance);
                    },
                });
            },
        })
    );
});
