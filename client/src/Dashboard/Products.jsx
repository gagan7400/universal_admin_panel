import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        inStock: true,
    });

    const fetchProducts = async () => {
        const { data } = await axios.get("http://localhost:4000/api/product/all");
        setProducts(data.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("/api/products/add", form);
        setForm({ name: "", price: "", category: "", inStock: true });
        fetchProducts();
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
    };

    return (
        <div className="p-4 w-full max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">🛒 Admin Product Management</h2>

            {/* Add Product Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 shadow-md rounded-lg mb-8" >
                <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" required />
                <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2 rounded" required />
                <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2 rounded" />
                <select value={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.value === "true" })} className="border p-2 rounded" >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                </select>
                <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" >                     Add Product                 </button>
            </form>

            {/* Product Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                        <tr>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Price</th>
                            <th className="py-3 px-4 text-left">Category</th>
                            <th className="py-3 px-4 text-left">Stock</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {console.log(products)}
                        {products && products.length > 0 && products.map((prod) => (
                            <tr key={prod._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{prod.name}</td>
                                <td className="py-3 px-4">${prod.price}</td>
                                <td className="py-3 px-4">{prod.category}</td>
                                <td className="py-3 px-4">
                                    {prod.inStock ? "In Stock" : "Out of Stock"}
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => handleDelete(prod._id)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Delete
                                    </button>
                                    {/* Add Edit button here if needed */}
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
