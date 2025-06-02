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
    const [dimensions, setDimensions] = useState({ width: "", height: "" });
    const [weight, setWeight] = useState("");
    const [size, setSize] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [material, setMaterial] = useState("");
    const [images, setImages] = useState("");
    const [section, setSection] = useState(true);
    const [isupdate, setIsupdate] = useState({ update: false, updateid: null })
    let getproducts = async () => {
        try {
            let { data } = await axios.get("http://localhost:4000/api/product/all");
            if (data.success) {
                setProducts(data.data)
            } else {
                setProducts([]);
                console.log("error", data.message)
            }

        } catch (error) {
            console.log("Error Fetching Data", error)
        }
    }
    useEffect(() => {
        getproducts();
    }, [])
    console.log(products)
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
    let deleteHandler = async (id) => {
        if (confirm("Are you sure you want to delete this ")) {
            try {
                let { data } = await axios.delete("http://localhost:4000/api/product/" + id, {
                    withCredentials: true
                })
                if (data.success) {
                    alert("product Deleted Successfully");
                    getproducts();
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    let updateHandler = (id, data) => {
        refresh()
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
        setPrice(data.price);
        setDimensions({ width: data.dimensions.width, height: data.dimensions.height });
        setSize(data.size);
        setMaterial(data.material);
        setRatings(data.ratings);
        setStock(data.stock);
        setWeight(data.weight);
        setMaterial(data.material);
        setDiscountPercentage(data.discountPercentage);
        setIsupdate({ update: true, updateid: id });
        setSection(!section)
    }

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
        <>
            <div className="max-w-6xl bg-amber-500  m-auto">
                <div className="w-full flex justify-end items-center  p-4">
                    <button onClick={() => { setSection(!section) }} className="bg-amber-50 text-black p-2 rounded-lg">{section ? <span className="w-fit min-w-fit flex  gap-1 items-center justify-center"><img src="/img/add-icon.svg"></img>Add New Product </span> : <span className="w-fit min-w-fit flex  gap-1 items-center justify-center"><img src="/img/arrow-back.svg"></img> Back </span>}</button>
                </div>
                {section ?
                    <>
                        <div className="relative overflow-x-auto shadow-md  ">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3"> Product name </th>
                                        <th scope="col" className="px-6 py-3"> Price </th>
                                        <th scope="col" className="px-6 py-3"> Description </th>
                                        <th scope="col" className="px-6 py-3"> Category </th>
                                        <th scope="col" className="px-6 py-3"> Stock </th>
                                        <th scope="col" className="px-6 py-3"> Size </th>
                                        <th scope="col" className="px-6 py-3"> dimensions </th>
                                        <th scope="col" className="px-6 py-3"> Actions  </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products && products.map((v, i) => (
                                        <tr className="bg-white border-b border-gray-200 text-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-emerald-950  whitespace-nowrap  ">
                                                {v.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {v.price}    </td>
                                            <td className="px-6 py-4">
                                                {v.description} </td>
                                            <td className="px-6 py-4">
                                                {v.category}     </td>
                                            <td className="px-6 py-4">
                                                {v.stock}     </td>
                                            <td className="px-6 py-4">
                                                {v.size}     </td>
                                            <td className="px-6 py-4">
                                                {v.dimensions.width} {v.dimensions.height}
                                            </td>
                                            <td className="px-6 py-4 min-w-fit whitespace-nowrap">
                                                <button type="button" onClick={() => { updateHandler(v._id, v) }} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Edit</button>
                                                <button type="button" onClick={() => { deleteHandler(v._id) }} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                    :
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
                    </form>}
            </div>
        </>
    );
}
