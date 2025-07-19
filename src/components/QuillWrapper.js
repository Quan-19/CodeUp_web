import React, { forwardRef, useRef, useImperativeHandle } from "react";
import ReactQuill from "react-quill";

const QuillWrapper = forwardRef((props, ref) => {
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current.getEditor(),
  }));

  return (
    <ReactQuill
      ref={quillRef}
      {...props}
    />
  );
});

export default QuillWrapper;
