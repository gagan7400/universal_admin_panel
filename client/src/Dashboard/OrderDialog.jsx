import { Dialog, DialogPanel } from '@headlessui/react'
import { useState, useMemo } from 'react'

/** Base API URL without trailing slash. Empty string = same origin (e.g. nginx serves /api on same host). */
function apiOrigin() {
    const raw = import.meta.env.VITE_API
    if (raw == null || raw === '') return ''
    return String(raw).replace(/\/$/, '')
}

export default function OrderDialog({ order }) {
    let [open, setOpen] = useState(false)

    const invoiceViewUrl = useMemo(() => {
        const base = apiOrigin()
        return `${base}/api/order/admin/order/${order?._id}/invoice`
    }, [order?._id])

    const invoiceDownloadUrl = useMemo(() => `${invoiceViewUrl}?download=1`, [invoiceViewUrl])

    const openInvoiceView = () => {
        const w = window.open(invoiceViewUrl, '_blank', 'noopener,noreferrer')
        if (!w) alert('Allow pop-ups for this site to view the invoice, or use Download PDF.')
    }

    const openInvoiceDownload = () => {
        const w = window.open(invoiceDownloadUrl, '_blank', 'noopener,noreferrer')
        if (!w) alert('Allow pop-ups for this site to download the invoice.')
    }
    return (
        <td className="px-4 py-3">
            <button
                onClick={() => setOpen(true)}
                className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
            >
                View
            </button>
            <Dialog open={open} onClose={() => setOpen(false)} className="z-50 fixed inset-0 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center px-4   bg-black/30">
                    <DialogPanel className="w-full max-w-6xl rounded-xl bg-white shadow-xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">Order Details</h2>
                            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-black">Close ✕</button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

                            {/* Left section: Order items and totals */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* User */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-4">User</h3>
                                    <div className="flex items-center justify-between py-3 border-b last:border-none">
                                        <div className="flex items-center gap-4">
                                            <img src={order?.user?.image?.url} alt={"image"} className="w-16 h-16 object-cover rounded-md  " />
                                            <div>
                                                <p className="font-medium">{order?.user?.name}</p>
                                                <p className="text-sm text-gray-500">Email: {order?.user?.email}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-700">Phone Number : {order?.user?.phone}</p>
                                    </div>
                                </div>
                                {/* Items */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-4">All Items</h3>
                                    {order?.orderItems?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-3 border-b last:border-none">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md  " />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-gray-700">₹{item.price}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart totals */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-4">Cart Totals</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>₹{Math.round(order?.itemsPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span>₹{Math.round(order?.shippingPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax (GST):</span>
                                            <span>₹{Math.round(order?.taxPrice)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-orange-600 border-t pt-2 mt-2">
                                            <span>Total Price:</span>
                                            <span>₹{Math.round(order?.totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right section: Summary, address, payment */}
                            <div className="space-y-6">

                                {/* Summary */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
                                    <p><span className="text-gray-500">Order ID:</span> <strong>#{order?._id?.slice(-6).toUpperCase()}</strong></p>
                                    <p><span className="text-gray-500">Date:</span> {new Date(order?.createdAt).toLocaleDateString()}</p>
                                    <p><span className="text-gray-500">Total:</span> <span className="text-red-500 font-bold">₹{Math.round(order?.totalPrice)}</span></p>
                                </div>

                                {/* Shipping address */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                                    <p className="text-sm text-gray-600">
                                        {order?.shippingInfo?.address}, {order?.shippingInfo?.city}, {order?.shippingInfo?.state},<br />
                                        {order?.shippingInfo?.country} - {order?.shippingInfo?.pinCode}
                                    </p>
                                </div>

                                {/* Payment method */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
                                    <p className="text-sm text-gray-600">{order?.paymentInfo?.status === 'COD' ? 'Cash on Delivery (COD)' : `Online - ${order?.paymentInfo?.status}`}</p>
                                </div>

                                {/* Invoice: PDF is rendered from HTML template (Puppeteer) */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Invoice</h3>
                                    {order?.invoiceNumber ? (
                                        <p className="text-sm text-gray-600 mb-3">{order.invoiceNumber}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500 mb-3">Legacy order — PDF is built from the HTML template on open/download.</p>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={openInvoiceView}
                                            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            View invoice (PDF)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={openInvoiceDownload}
                                            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800"
                                        >
                                            Download PDF
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        If a new tab is blocked, use:&nbsp;
                                        <a href={invoiceViewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            view
                                        </a>
                                        {' · '}
                                        <a href={invoiceDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            download
                                        </a>
                                    </p>
                                </div>

                                {/* Delivery date */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Expected Date Of Delivery</h3>
                                    <p className="text-sm text-green-600 font-medium">
                                        {order?.createdAt ? order?.orderStatus == "Delivered" ? "Delivered" : new Date(order.createdAt).toDateString() : "Not Delivered Yet"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </td>
    )
}
