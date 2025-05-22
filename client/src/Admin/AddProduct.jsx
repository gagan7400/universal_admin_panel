import React, { useState } from 'react'

export default function AddProduct() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [images, setImages] = useState([{ fileName: "", url: "" }])
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState("")
    const [dimensions, setDimensions] = useState({ width: "", height: "" })
    const [weight, setWeight] = useState("")
    const [size, setSize] = useState("")
    const [discountPercentage, setDiscountPercentage] = useState("")
    const [material, setMaterial] = useState("");

    let submithandler = (e) => {
        e.preventDefault();
        console.log({ name, price, description, images, category, stock, dimensions, weight, size, discountPercentage, material })
    }
    return (
        <div>
            <p>Add Product Form</p>
            <form className='product_form' onClick={submithandler}>
                <div className="form_labels">
                    <label htmlhtmlFor="name">Product Name</label>
                    <input type="text" id='name' value={name} onChange={(e) => { setName(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="description">Product Description</label>
                    <input type="text" id='description' value={description} onChange={(e) => { setDescription(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="price">Product Price</label>
                    <input type="number" id='price' value={price} onChange={(e) => { setPrice(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="images">Product Images</label>
                    <input type="file" id='images' value={images} onChange={(e) => { setImages(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="category">Product Category</label>
                    <input type="text" id='category' value={category} onChange={(e) => { setCategory(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="stock">Product Stock</label>
                    <input type="number" id='stock' value={stock} onChange={(e) => { setStock(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="dimensions">Product Dimensions</label>
                    <input type="text" id='dimensions' value={dimensions} onChange={(e) => { setDimensions(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="weight">Product weight</label>
                    <input type="text" id='weight' value={weight} onChange={(e) => { setWeight(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="size">Product Size</label>
                    <input type="text" id='size' value={size} onChange={(e) => { setSize(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="discountPercentage">Product DiscountPercentage</label>
                    <input type="text" id='discountPercentage' value={discountPercentage} onChange={(e) => { setDiscountPercentage(e.target.value) }} />
                </div>
                <div className="form_labels">
                    <label htmlhtmlFor="material">Product Material</label>
                    <input type="text" id='material' value={material} onChange={(e) => { setMaterial(e.target.value) }} />
                </div>
                <div className="submition">
                    <input type="submit" value="Add Product" />
                </div>
            </form>
        </div>
    )
}
