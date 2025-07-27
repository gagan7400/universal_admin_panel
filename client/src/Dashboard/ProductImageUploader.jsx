import React, { useRef, useState } from "react";

const ProductImageUploader = ({ images, setImages, bannerImage, setBannerImage, title, setDeletedImages = () => { } }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleFiles = (files) => {
        if (images) {
         const fileArray = Array.from(files).map((file) => ({
                fileName: file.name,
                url: URL.createObjectURL(file),
                file,
            }));
            setImages((prev) => [...prev, ...fileArray]);

        } else {
             const fileArray = Array.from(files).map((file) => ({
                fileName: file.name,
                url: URL.createObjectURL(file),
                file,
            }));
            setBannerImage((prev) => [...prev, ...fileArray]);
        }

    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (e) => {
        handleFiles(e.target.files);
    };

    return (
        <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">{title}</label>
            <div
                className={`border-2 border-dashed rounded-md h-48 flex flex-col justify-center items-center cursor-pointer transition-colors duration-300 hover:border-amber-400 ${dragging
                    ? "border-blue-400 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-500 bg-white"
                    }`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <svg
                    className="w-10 h-10 mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                </svg>


                <p className="text-sm font-medium">Click or drag & drop images</p>
                <p className="text-xs text-gray-400 mt-1">Max. File Size: 30MB</p>
            </div>

            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
            />
             {/* Preview Section */}
            {images ? images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200">
                            <img
                                src={img.url}
                                alt={`Product ${index}`}
                                className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-1 right-1 bg-white text-red-500 hover:text-red-700 rounded-full p-1 cursor-pointer shadow"
                                onClick={() => {
                                    const removedImage = images[index];
                                    if (!removedImage.file && removedImage.url) {
                                        setDeletedImages((prev) => [...prev, removedImage]);
                                    }
                                    setImages((prev) => prev.filter((_, i) => i !== index));
                                }}
                            >
                                ✕
                            </div>
                        </div>
                    ))}
                </div>
            ) : (!Array.isArray(bannerImage) || bannerImage.length > 0) && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                    {Array.isArray(bannerImage) ? bannerImage.map((img, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200">
                            <img
                                src={img.url}
                                alt={`Product ${index}`}
                                className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-1 right-1 bg-white text-red-500 hover:text-red-700 rounded-full p-1 cursor-pointer shadow"
                                onClick={() =>
                                    setBannerImage("")
                                }
                            >
                                ✕
                            </div>
                        </div>
                    )) : <> {bannerImage && <div className="relative group rounded-md overflow-hidden border border-gray-200">
                        <img

                            src={bannerImage.url}
                            alt={`Product ${bannerImage.fileName}`}
                            className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-1 right-1 bg-white text-red-500 hover:text-red-700 rounded-full p-1 cursor-pointer shadow"
                            onClick={() =>
                                setBannerImage("")
                            }
                        >
                            ✕
                        </div>
                    </div>}</>
                    }
                </div>
            )}
        </div>
    );
};

export default ProductImageUploader;
