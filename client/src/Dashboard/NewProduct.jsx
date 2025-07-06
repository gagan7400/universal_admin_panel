import { useState } from "react";
import axios from "axios";
import ProductImageUploader from "./ProductImageUploader";

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
  const [images, setImages] = useState([]);
  const [bannerImage, setBannerImage] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img.file));
    formData.append("bannerImage", bannerImage[0].file);

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

    try {
      const { data } = await axios.post("http://localhost:4000/api/product/new", formData, {
        withCredentials: true,
      });
      if (data.success) {
        alert("Product Created Successfully");
        refresh();
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.error("Error uploading product:", err);
    }
  };

  const refresh = () => {
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
    setDiscountPercentage("");
    setImages([]);
    setBannerImage([]);
  };

  return (
    <form onSubmit={handleSubmit} className="  mx-auto bg-white shadow-xl rounded-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold   text-gray-800 mb-2">🛒 Add New Product</h2>
        <p className="text-sm text-gray-500">Fill in the details to add a new product to your store.</p>
      </div>

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
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400">
            <option className="hover:bg-amber-400">Select category</option>
            <option className="hover:bg-amber-400">Iron</option>
            <option className="hover:bg-amber-400" >Bronze</option>
            <option className="hover:bg-amber-400" >Silver</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Dimensions (W × H)</label>
          <div className="flex gap-2">
            <input type="text" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })} placeholder="Width" className="w-1/2 border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
            <input type="text" value={dimensions.height} onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })} placeholder="Height" className="w-1/2 border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
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
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write product description..." rows={5} className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 hover:border-amber-400" />
      </div>

      <div className="mt-6">
        <ProductImageUploader bannerImage={bannerImage} setBannerImage={setBannerImage} title="Banner Image" />
      </div>
      <div className="mt-6">
        <ProductImageUploader images={images} setImages={setImages} title="Product Images" />
      </div>

      <div className="mt-6 text-right">
        <button type="submit" className=" bg-amber-400 text-white  hover:bg-amber-600 hover:text-blue-50 px-6 py-2.5 rounded-md shadow-lg duration-75 transition-transform transform  ">
          Add Product
        </button>
      </div>
    </form>
  );
}
