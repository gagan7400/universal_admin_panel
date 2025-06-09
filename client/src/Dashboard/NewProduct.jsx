
import { useEffect, useState } from "react";
import axios from "axios";
import ProductImageUploader from "./ProductImageUploader ";

export default function NewProduct() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [ratings, setRatings] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [dimensions, setDimensions] = useState({ width: "", height: "" });
    const [weight, setWeight] = useState("");
    const [size, setSize] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [material, setMaterial] = useState("");
    const [images, setImages] = useState("");
    const [section, setSection] = useState(true);
    const [isupdate, setIsupdate] = useState({ update: false, updateid: null })


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append images
        images.forEach((img) => {
            formData.append("images", img.file); // Use the File object
        });

        // Append other fields
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("ratings", ratings);
        formData.append("category", category);
        formData.append("stock", stock);
        formData.append("weight", weight);
        formData.append("size", size);
        formData.append("discountPercentage", discountPercentage);
        formData.append("material", material);
        formData.append("dimensions", JSON.stringify(dimensions));

        if (isupdate.update && isupdate.updateid) {
            try {
                const { data } = await axios.put("http://localhost:4000/api/product/" + isupdate.updateid, formData, {
                    withCredentials: true, // ✅ this should be inside the same config object
                });

                if (data.success) {
                    alert("product Updated Successfully");
                    getproducts();
                    setIsupdate({ update: false, updateid: null })
                    refresh()
                    setSection(!section);
                } else {
                    console.log(data.message);
                }
            } catch (err) {
                console.error("Error Updating Product:", err);
            }
        } else {
            try {
                const { data } = await axios.post("http://localhost:4000/api/product/new", formData, {
                    withCredentials: true, // ✅ this should be inside the same config object
                });

                if (data.success) {
                    alert("product Created Successfully");
                    getproducts();
                    refresh()
                    setSection(!section);
                } else {
                    console.log(data.message);
                }
            } catch (err) {
                console.error("Error uploading product:", err);
            }
        }
    };

    let refresh = () => {
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setDimensions({ width: "", height: "" });
        setSize("");
        setMaterial("");
        setRatings("");
        setStock("");
        setWeight("");
        setMaterial("");
        setDiscountPercentage("");
        setImages("")
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className=" mx-auto p-6 bg-white shadow-md rounded-md">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">New Product</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Product Name</label>
                            <input type="text" placeholder="Enter Product Name" value={name} onChange={(e) => { setName(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Price</label>
                            <input type="number" placeholder="Enter Product Price" value={price} onChange={(e) => { setPrice(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Ratings (in Number)</label>
                            <input type="number" placeholder="Enter Product Rating (in number)" value={ratings} onChange={(e) => { setRatings(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Stock (in Number)</label>
                            <input type="number" placeholder="Enter Product Stock (in Number)" value={stock} onChange={(e) => { setStock(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Category</label>
                            <select value={category} onChange={(e) => { setCategory(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500">
                                <option>Select category</option>
                                <option>Item 1</option>
                                <option>Item 2</option>
                                <option>Item 3</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Dimensions Width</label>
                            <input type="text" placeholder="Enter Product Dimensions Width" value={dimensions.width} onChange={(e) => { setDimensions({ ...dimensions, width: e.target.value }) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Dimensions Height</label>
                            <input type="text" placeholder="Enter Product Dimensions Height" value={dimensions.height} onChange={(e) => { setDimensions({ ...dimensions, height: e.target.value }) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Size</label>
                            <input type="text" placeholder="Enter Product Size" value={size} onChange={(e) => { setSize(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Weight  (in kg)</label>
                            <input type="text" placeholder="Enter Product Weight (in kg)" value={weight} onChange={(e) => { setWeight(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500 " />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Material</label>
                            <input type="text" placeholder="Enter Product Material" value={material} onChange={(e) => { setMaterial(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 block">Discount Percentage (in Number)</label>
                            <input type="number" placeholder="Enter Product Discount Percentage (in Number)" value={discountPercentage} onChange={(e) => { setDiscountPercentage(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <textarea
                                placeholder="Write Product Description Here"
                                rows={7} value={description} onChange={(e) => { setDescription(e.target.value) }}
                                className="w-full border border-gray-300 rounded p-3  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500"
                            ></textarea>
                        </div>
                        <ProductImageUploader images={images} setImages={setImages} />
                    </div>

                    <button type="submit" className="  bg-blue-600 text-white px-4 py-2 rounded-md">{isupdate.update ? "Update Product" : "Add product"}</button>
                </div>
            </form>
        </div>
    )
}
