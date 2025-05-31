import React, { useRef } from "react";

const ProductImageUploader = ({ images, setImages }) => {
    const inputRef = useRef(null);

    const handleFiles = (files) => {
        const fileArray = Array.from(files).map((file) => ({
            fileName: file.name,
            url: URL.createObjectURL(file),
            file,
        }));
        setImages((prev) => [...prev, ...fileArray]);
        console.log(fileArray)
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (e) => {
        e.preventDefault();
        handleFiles(e.target.files);
    };

    return (
        <div>
            <label className="text-sm font-medium mb-1 block">Product Images</label>

            {/* Upload Zone */}
            <div
                className="border-dashed border-2 border-gray-300 rounded-md h-48 flex flex-col justify-center items-center text-gray-500 cursor-pointer"
                onClick={handleClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Click to upload or drag and drop
                <p className="text-xs text-gray-400 mt-1">Max. File Size: 30MB</p>
            </div>

            {/* Hidden Input */}
            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
            />

            {/* Previews */}
            {/* <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="relative group">
                        <img src={img.url} alt={`Product ${index}`} className="rounded-md w-full h-24 object-cover" />
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default ProductImageUploader;
