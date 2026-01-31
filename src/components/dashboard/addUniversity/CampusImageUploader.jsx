import React from "react";
import { MdOutlineCloudUpload } from "react-icons/md";

export default function CampusImageUploader({ images, onChange }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onChange([...images, ...files]);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <>
      <h3 className="text-light-green text-lg font-bold leading-tight tracking-[-0.015em] border-b border-light-gray pb-3">
        Upload Campus Images (Optional)
      </h3>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Campus ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border-dark"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-center w-full border-2 border-dotted border-dark-green rounded-md bg-dark-black">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-border-dark border-dashed rounded-xl cursor-pointer bg-background-dark hover:bg-border-dark/30"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-white">
            <span className="text-white text-4xl text-text-subtle mb-4"><MdOutlineCloudUpload /></span>
            <p className="mb-2 text-sm text-white">
              <span className="font-semibold text-light-green">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-text-subtle">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            {images.length > 0 && (
              <p className="text-xs text-light-green mt-2">{images.length} image(s) selected</p>
            )}
          </div>
          <input 
            id="dropzone-file" 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
            className="hidden" 
          />
        </label>
      </div>
    </>
  );
}
