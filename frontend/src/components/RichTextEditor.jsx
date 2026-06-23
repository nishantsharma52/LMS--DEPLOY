import React from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {

  const handleChange = (content) => {
    // 🚨 YAHAN ASLI FIX HAI: 'prev' lagane se baaki fields kabhi empty nahi hongi!
    setInput((prev) => ({ ...prev, description: content }));
  };

  return (
    <ReactQuill
      theme="snow"
      value={input.description || ""}
      onChange={handleChange}
    />
  );
};

export default RichTextEditor;

