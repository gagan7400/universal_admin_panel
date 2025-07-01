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
            <div className="m-auto">
                <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                    <div>
                        <button id="dropdownRadioButton" data-dropdown-toggle="dropdownRadio" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5  " type="button">
                            <svg className="w-3 h-3 text-gray-500   me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                            </svg>
                            Last 30 days
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        <div id="dropdownRadio" className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="top" style={{ position: "absolute", inset: "auto auto 0px 0px", margin: "0px", transform: "translate3d(522.5px, 3847.5px, 0px)" }}>
                            <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                                <li>
                                    <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <input id="filter-radio-example-1" type="radio" value="" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label for="filter-radio-example-1" className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">Last day</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <label for="table-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                        </div>
                        <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md  rounded-md ">
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
                                    <td className="px-6 py-4   whitespace-nowrap">
                                        <button type="button" onClick={() => { updateHandler(v._id, v) }} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Edit</button>
                                        <button type="button" onClick={() => { deleteHandler(v._id) }} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
