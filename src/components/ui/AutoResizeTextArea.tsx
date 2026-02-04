import React, { useEffect, useRef } from "react";

interface AutoResizeTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value?: string;
}

const AutoResizeTextArea: React.FC<AutoResizeTextAreaProps> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [props.value]);

    return (
        <textarea
            {...props}
            ref={textareaRef}
            rows={1}
            onChange={(e) => {
                adjustHeight();
                if (props.onChange) {
                    props.onChange(e);
                }
            }}
            style={{ ...props.style, overflow: "hidden", resize: "none" }}
        />
    );
};

export default AutoResizeTextArea;
