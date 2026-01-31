import React, { useState } from "react";

export default function TagsInput({ tags, onChange }) {
  const [inputValue, setInputValue] = useState("");

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const addTag = (e) => {
    e.preventDefault();
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
      setInputValue("");
    }
  };

  return (
    <>
      <h3 className="text-light-green text-lg font-bold leading-tight tracking-[-0.015em] border-b border-light-gray pb-3">
        Tags or Specializations
      </h3>
      <div className="flex flex-col gap-2">
        <label htmlFor="tags-input" className="text-sm font-medium text-white">
          Add tags to improve searchability
        </label>
        <form
          onSubmit={addTag}
          className="flex flex-wrap items-center gap-2 p-2 bg-background-dark border border-border-dark rounded-lg"
        >
          {tags.map((tag, index) => (
            <span
              key={tag}
              className="bg-light-green text-dark-green text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-primary/70 hover:text-primary"
              >
                ×
              </button>
            </span>
          ))}
          <input
            id="tags-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a tag and press enter"
            className="form-input flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-text-subtle"
          />
        </form>
      </div>
    </>
  );
}
