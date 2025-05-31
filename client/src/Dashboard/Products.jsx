import { useEffect, useState } from "react";
import axios from "axios";
import ProductImageUploader from "./ProductImageUploader ";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [ratings, setRatings] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [weight, setWeight] = useState("");
    const [size, setSize] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [material, setMaterial] = useState("");
    const [images, setImages] = useState("");


    // let submitHandler = (e) => {
    //     e.preventDefault();
    //     let newproduct = { name, description, price, ratings, category, stock, dimensions, weight, size, discountPercentage, material };
    //     let formData = new FormData();



    // }
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
        formData.append("dimensions", dimensions);
        formData.append("dimensions[width]", dimensions);
        formData.append("dimensions[height]", dimensions);
        try {
            const res = await axios.post("http://localhost:4000/api/product/new", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true, // ✅ this should be inside the same config object
            });

            console.log("Product created:", res.data);
        } catch (err) {
            console.error("Error uploading product:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
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
                        <label className="text-sm font-medium mb-1 block">Ratings</label>
                        <input type="text" placeholder="Enter Product Rating" value={ratings} onChange={(e) => { setRatings(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1 block">Stock</label>
                        <input type="text" placeholder="Enter Product Stock" value={stock} onChange={(e) => { setStock(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
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
                        <label className="text-sm font-medium mb-1 block">Dimensions</label>
                        <input type="text" placeholder="Enter Product Dimensions" value={dimensions} onChange={(e) => { setDimensions(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
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
                        <label className="text-sm font-medium mb-1 block">Discount Percentage</label>
                        <input type="text" placeholder="Enter Product Discount Percentage" value={discountPercentage} onChange={(e) => { setDiscountPercentage(e.target.value) }} className="input border border-gray-300 rounded p-2  focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500" />
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
                    {/* <div>
                        <label className="text-sm font-medium mb-1 block">Product Images</label>
                        <div className="border-dashed border-2 border-gray-300 rounded-md h-48 flex flex-col justify-center items-center text-gray-500">
                            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            Click to upload or drag and drop
                            <p className="text-xs text-gray-400 mt-1">Max. File Size: 30MB</p>
                        </div>
                    </div> */}
                </div>

                <button type="submit" className="  bg-blue-600 text-white px-4 py-2 rounded-md">Add product</button>
            </div>
        </form>
        // <div className="p-4 w-full max-w-6xl min-w-[500px] mx-auto ">
        //     <h2 className="text-2xl font-bold mb-6 text-center">🛒 Admin Product Management</h2>

        //     {/* Add Product Form */}
        //     <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 shadow-md rounded-lg mb-8" >
        //         <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" required />
        //         <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2 rounded" required />
        //         <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2 rounded" />
        //         <select value={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.value === "true" })} className="border p-2 rounded" >
        //             <option value="true">In Stock</option>
        //             <option value="false">Out of Stock</option>
        //         </select>
        //         <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" >                     Add Product                 </button>
        //     </form>

        //     {/* Product Table */}
        //     <div className="overflow-x-auto">
        //         <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        //             <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
        //                 <tr>
        //                     <th className="py-3 px-4 text-left">Name</th>
        //                     <th className="py-3 px-4 text-left">Price</th>
        //                     <th className="py-3 px-4 text-left">Category</th>
        //                     <th className="py-3 px-4 text-left">Stock</th>
        //                     <th className="py-3 px-4 text-left">Actions</th>
        //                 </tr>
        //             </thead>
        //             <tbody className="text-gray-700">
        //                 {console.log(products)}
        //                 {products && products.length > 0 && products.map((prod) => (
        //                     <tr key={prod._id} className="border-b hover:bg-gray-50">
        //                         <td className="py-3 px-4">{prod.name}</td>
        //                         <td className="py-3 px-4">${prod.price}</td>
        //                         <td className="py-3 px-4">{prod.category}</td>
        //                         <td className="py-3 px-4">
        //                             {prod.inStock ? "In Stock" : "Out of Stock"}
        //                         </td>
        //                         <td className="py-3 px-4">
        //                             <button
        //                                 onClick={() => handleDelete(prod._id)}
        //                                 className="text-red-600 hover:text-red-800 font-medium"
        //                             >
        //                                 Delete
        //                             </button>
        //                             {/* Add Edit button here if needed */}
        //                         </td>
        //                     </tr>
        //                 ))}
        //                 {products.length === 0 && (
        //                     <tr>
        //                         <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
        //                             No products found.
        //                         </td>
        //                     </tr>
        //                 )}
        //             </tbody>
        //         </table>
        //     </div>
        // </div>
    );
}
