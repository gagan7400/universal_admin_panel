import { useEffect, useState } from "react";
import axios from "axios";
import ProductImageUploader from "./ProductImageUploader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";
import { useLocation } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

export default function Products() {
    const API = import.meta.env.VITE_API;

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 5;

    // new product statess start
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [ratings, setRatings] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [dimensions, setDimensions] = useState({ width: "", height: "", length: "" });
    const [weight, setWeight] = useState("");
    const [size, setSize] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [gstRate, setGstRate] = useState("");
    const [HSN, setHSN] = useState("");
    const [material, setMaterial] = useState("");
    const [images, setImages] = useState([]);
    const [bannerImage, setBannerImage] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false)
    const [isUpdateId, setIsUpdateId] = useState(null)
    const [deletedImages, setDeletedImages] = useState([]);
    let { admin } = useSelector(state => state.auth);
    let [pageloading, setpageLoading] = useState(true);
    let location = useLocation()
    const [options, setOptions] = useState([])
    useEffect(() => {
        setTimeout(() => {
            setpageLoading(false);
        }, [500])
    }, [location])
    const getAllCategories = async () => {
        try {
            let { data } = await axios.get(`${API}/api/product/categories`);
            if (data.success) {
             
                setCategories(data.data);
                setOptions(data.data.map((v, i) => {
                    return { value: v, label: v }
                }))
            } else {
                setCategories([]);
                toast.error(data.message || "Error occured");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error occured");
        }
    }
    const handleCreate = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        setOptions([...options, newOption]);
        setCategory(newOption.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // ✅ Fix: Always send retained + newly uploaded images
        const retainedImages = images.filter((img) => !img.file);
        formData.append("imagesData", JSON.stringify(retainedImages));
        images.forEach((img) => {
            if (img.file) formData.append("images", img.file);
        });

        // ✅ Banner image logic (same as before)
        if (bannerImage.length > 0 && bannerImage[0]?.file) {
            formData.append("bannerImage", bannerImage[0].file);
        } else if (bannerImage.length > 0 && !bannerImage[0]?.file) {
            formData.append("bannerImageData", JSON.stringify(bannerImage[0]));
        }
        // ✅ Append other product fields
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("ratings", ratings);
        formData.append("category", category?.value || category);
        formData.append("stock", stock);
        formData.append("weight", weight);
        formData.append("size", size);
        formData.append("discountPercentage", discountPercentage);
        formData.append("gstRate", gstRate);
        formData.append("HSN", HSN);
        formData.append("material", material);
        formData.append("dimensions", JSON.stringify(dimensions));

        // ✅ Update or Create Logic
        if (isUpdate && isUpdateId) {
            try {
                const { data } = await axios.put(`${API}/api/product/${isUpdateId}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (data.success) {
                    alert("✅ Product Updated Successfully");
                    refresh();
                    setShow(false);
                    setIsUpdate(false);
                    setIsUpdateId(null);
                    getProducts();
                } else {

                }
            } catch (err) {

            }
        } else {
            // 👇 Add New Product Logic (already working)
            try {
                const { data } = await axios.post(`${API}/api/product/new`, formData, {
                    withCredentials: true,
                });
                if (data.success) {
                    alert("✅ Product Created Successfully");
                    refresh();
                    getProducts();
                    setShow(false);
                } else {
                    toast.error(data.message || "Error occured");
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Error occured");
            }
        }
    };

    const refresh = () => {
        setName("");
        setDescription("");
        setCategory({
            value: "",
            label: ""
        });
        setPrice("");
        setDimensions({ width: "", height: "", length: "" });
        setSize("");
        setMaterial("");
        setRatings("");
        setStock("");
        setWeight("");
        setDiscountPercentage("");
        setGstRate("");
        setHSN("");
        setImages([]);
        setBannerImage([]);
    };

    let cancel = () => {
        refresh();
        setIsUpdate(false)
        setIsUpdateId(null)
        setShow(false)
         
    }
    // new product statess end 

    const getProducts = async () => {
        setLoading(true)
        try {
            let { data } = await axios.get(`${API}/api/product/all`);
            if (data.success) {
                setProducts(data.data);
                setFilteredProducts(data.data);
            } else {
                setProducts([]);
                toast.error(data.message || "Error occured");
            }
            setLoading(false)
        } catch (error) {
            toast.error(error.response?.data?.message || "Error occured");
            setLoading(false)
        }
    };

    useEffect(() => {
        getAllCategories()
        getProducts();
    }, [show]);

    // 🌟 Filtering Logic
    useEffect(() => {
        let temp = [...products];
        if (search) {
            const keyword = search.toLowerCase();
            temp = temp.filter((item) =>
                `${item.name} ${item.category} ${item.price} ${item.size} ${item.stock}`
                    .toLowerCase()
                    .includes(keyword)
            );
        }
        if (selectedCategory !== "All") {
            temp = temp.filter((item) => item.category === selectedCategory);
        }
        if (sortField) {
            temp.sort((a, b) => {
                const valA = a[sortField];
                const valB = b[sortField];
                return sortOrder === "asc"
                    ? valA.localeCompare?.(valB) ?? valA - valB
                    : valB.localeCompare?.(valA) ?? valB - valA;
            });
        }
        setFilteredProducts(temp);
        setCurrentPage(1);
    }, [search, sortField, sortOrder, selectedCategory, products]);

    const deleteHandler = async (id) => {
        if (confirm("Are you sure you want to delete this ")) {
            try {
                let { data } = await axios.delete(`${API}/api/product/${id}`, {
                    withCredentials: true,
                });
                if (data.success) {
                    alert("Product Deleted Successfully");
                    getProducts();
                } else {
                    toast.error(data?.message || "Error occured");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Error occured");
            }
        }
    };


    const updateHandler = (id, data) => {
        setName(data.name);
        setDescription(data.description);
        setCategory({ label: data.category, value: data.category });
        setPrice(data.price);
        setDimensions({ width: data.dimensions.width, length: data.dimensions.length, height: data.dimensions.height });
        setSize(data.size);
        setMaterial(data.material);
        setRatings(data.ratings);
        setStock(data.stock);
        setWeight(data.weight);
        setDiscountPercentage(data.discountPercentage);
        setGstRate(data.gstRate);
        setHSN(data.HSN);

        // Wrap existing images into fake File-like objects
        const existingImages = data.images.map(img => ({
            file: null, // new uploads will have actual files
            previewUrl: img.url,
            isExisting: true, // flag to skip sending again
            url: img.url
        }));
        const existingBanner = data.bannerImage ? [{
            file: null,
            previewUrl: data.bannerImage.url,
            isExisting: true,
            url: data.bannerImage.url
        }] : [];

        setImages(existingImages);
        setBannerImage(existingBanner);
        setShow(true);
        setIsUpdate(true);
        setIsUpdateId(id);
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // const categories = ["All", ...new Set(products.map((item) => item.category))];
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedData = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            {pageloading ? <div className="w-full h-full flex justify-center items-center p-3"><Loader /></div> :
                <div className="min-w-[800px] ">
                    {show ?
                        <>
                            <div className="  mx-auto bg-white rounded-xl shadow-xl sm:p-6 p-3 ">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>
                                <div className="flex flex-wrap gap-4 justify-start lg:justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold   text-gray-800 cursor-pointer ">🛒 Add New Product</h2>
                                    <div className="w-1/5   min-w-fit flex  gap-4 justify-end items-center  ">
                                        <button className="bg-[var(--blue)] text-white  min-w-fit hover:bg-blue-900 hover:text-blue-50 px-2 py-2.5 rounded-md shadow-lg duration-75 transition-all whitespace-nowrap flex " onClick={() => { setShow(false) }}>View Products</button>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit} className="mx-auto ">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Price</label>
                                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Ratings</label>
                                            <input type="number" value={ratings} onChange={(e) => setRatings(e.target.value)} placeholder="Rating out of 5" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Stock</label>
                                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock quantity" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Category</label>
                                            {/*<select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400">
                                                {categories.map((cat, idx) => (
                                                    <option className="hover:bg-[var(--blue)]" key={idx} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                                 <option className="hover:bg-[var(--blue)]">Select category</option>
                                                <option className="hover:bg-[var(--blue)]">Iron</option>
                                                <option className="hover:bg-[var(--blue)]" >Bronze</option>
                                                <option className="hover:bg-[var(--blue)]" >Silver</option>
                                            </select> */}
                                            <CreatableSelect
                                                isClearable
                                                onChange={setCategory}
                                                onCreateOption={handleCreate}
                                                options={options}
                                                value={category}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Dimensions (L x W × H ) in cm</label>
                                            <div className="flex gap-2">
                                                 
                                                <input type="text" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })} placeholder="Width" className="w-1/2 border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                                <input type="text" value={dimensions.height} onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })} placeholder="Height" className="w-1/2 border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                                <input type="text" value={dimensions.length} onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })} placeholder="Length" className="w-1/2 border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Size</label>
                                            <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Enter size" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Weight (kg)</label>
                                            <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Material</label>
                                            <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Enter material" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
                                            <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} placeholder="Enter discount" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1">GST Rate (%)</label>
                                            <input type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} placeholder="Enter gstRate" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-semibold text-gray-700 mb-1"> HSN </label>
                                            <input type="text" value={HSN} onChange={(e) => setHSN(e.target.value)} placeholder="Enter HSN" className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write product description..." rows={5} className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
                                    </div>

                                    <div className="mt-6">
                                        <ProductImageUploader bannerImage={bannerImage} setBannerImage={setBannerImage} title="Banner Image" />
                                    </div>
                                    <div className="mt-6">
                                        <ProductImageUploader images={images} setImages={setImages} title="Product Images" setDeletedImages={setDeletedImages} />
                                    </div>

                                    <div className="mt-6 text-right flex lg:justify-end justify-start gap-2 items-center">
                                        <button type="button" onClick={cancel} className="bg-red-600 text-white  hover:bg-blue-900 hover:text-blue-50 px-6 py-2.5 rounded-md shadow-lg duration-75 transition-transform transform  ">
                                            Cancel
                                        </button>
                                        <button type="submit" className=" bg-[var(--blue)] text-white  hover:bg-blue-900 hover:text-blue-50 px-6 py-2.5 rounded-md shadow-lg duration-75 transition-transform transform  ">
                                            {isUpdate ? "Update Product" : "Add Product"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                        :
                        <>
                            <div className="mx-auto bg-white rounded-xl shadow-xl sm:p-6 p-3">
                                <h2 className="text-2xl  font-semibold text-gray-800 mb-4">Products</h2>
                                {/* Top controls */}
                                <div>
                                    <div className="flex flex-wrap gap-4 lg:justify-between justify-start items-center mb-6">
                                        <input
                                            type="text"
                                            placeholder="Search Products..."
                                            className="lg:w-64  w-30 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <div className={`w-1/5 min-w-fit flex gap-4  ${admin.role == "admin" ? "justify-end" : "justify-start md:justify-end"} items-center`}>
                                            {admin.role == "admin" && <button className="bg-[var(--blue)] text-white  min-w-fit hover:bg-blue-900 hover:text-blue-50 px-2 py-2.5 rounded-md shadow-lg duration-75 transition-all whitespace-nowrap flex " onClick={() => { setShow(true) }}>  Add New Product</button>}
                                            <select
                                                className="p-2 w-25 bg-[var(--blue)] text-white border-0 focus:outline-0 focus:border-0 focus:ring-0 hover:bg-blue-900 hover:text-blue-50 px-3 py-2.5 rounded-md shadow-lg transition-all duration-75"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                <option value="All">All</option>
                                                {categories.map((cat, idx) => (

                                                    <option key={idx} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        {loading ? <div className="flex justify-center items-center p-3"><Loader /></div> : <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                                            <thead className="bg-blue-100 text-gray-700 text-xs uppercase">
                                                <tr>
                                                    {["Banner", "name", "price", "description", "category", "stock", "size", "dimensions", "Images"].map((col) => (
                                                        <th
                                                            key={col}
                                                            className="px-6 py-3 cursor-pointer select-none"
                                                            onClick={() => handleSort(col)}
                                                        >
                                                            {["Banner", "Images"].includes(col) ? <div className="flex items-center gap-1">
                                                                <span className="capitalize">{col}</span>
                                                            </div> : <div className="flex items-center gap-1">
                                                                <span className="capitalize">{col}</span>
                                                                {sortField === col ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
                                                            </div>}
                                                        </th>
                                                    ))}

                                                    {admin.role == "admin" && <th className="px-6 py-3">Action </th>}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {paginatedData.map((v, i) => (
                                                    <tr key={v._id} className="hover:bg-blue-50">
                                                        <td className="px-6 py-3 flex justify-center flex-wrap items-center gap-3">
                                                            <img src={v.bannerImage && v.bannerImage.url} alt="d" className="w-5 h-5" />
                                                        </td>
                                                        <td className="px-6 py-3 text-blue-900 font-medium">{v.name}</td>

                                                        <td className="px-6 py-3">₹{v.price}</td>
                                                        <td className="px-6 py-3">{v.description}</td>
                                                        <td className="px-6 py-3">{v.category}</td>
                                                        <td className="px-6 py-3">{v.stock}</td>
                                                        <td className="px-6 py-3">{v.size}</td>
                                                        <td className="px-6 py-3">
                                                            {v.dimensions.width} x {v.dimensions.height} x {v.dimensions.length} cm
                                                        </td>

                                                        <td className="px-6 py-3 flex justify-center flex-wrap items-center gap-3">
                                                            {v.images.map((img, ind) => {
                                                                return (<img key={ind} src={img.url} alt="d" className="w-5 h-5" />
                                                                )
                                                            })}
                                                        </td>
                                                        {admin.role == "admin" && <td className="px-6 py-3 min-w-fit whitespace-nowrap">
                                                            <button
                                                                onClick={() => updateHandler(v._id, v)}
                                                                className=" text-xs font-semibold   rounded-lg hover:scale-110"
                                                            >
                                                                <img src="/img/newedit.svg" alt="" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteHandler(v._id)}
                                                                className=" text-xs font-semibold  ms-2  rounded-lg  hover:scale-110"
                                                            >
                                                                <img src="/img/delete-icon.svg" alt="" />
                                                            </button>
                                                        </td>}
                                                    </tr>
                                                ))}
                                                {paginatedData.length === 0 && (
                                                    <tr>
                                                        <td colSpan="8" className="text-center py-6 text-gray-500">
                                                            No products found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>}
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                                        <p>
                                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
                                            {filteredProducts.length} entries
                                        </p>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                            >
                                                Prev
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`px-3 py-1 rounded ${currentPage === i + 1
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 hover:bg-gray-300"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
        </>
    );
}
