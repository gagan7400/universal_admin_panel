const { Product } = require("../models/productModel");
const Cart = require("../models/cart");

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // KM
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const calculateCartPriceServerSide = async (userId, destination, packagingType) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalProductCost = 0;
  let totalShippingCost = 0;
  let totalPackagingCost = 0;
  const orderItems = [];

  const warehouseLat = Number(process.env.WAREHOUSE_LATITUDE ?? 28.6139);
  const warehouseLng = Number(process.env.WAREHOUSE_LONGITUDE ?? 75.8);

  const destLat = Number(destination?.latitude);
  const destLng = Number(destination?.longitude);

  let distanceKM = 0;
  let hasValidDestination = false;

  if (
    destination &&
    Number.isFinite(destLat) && Number.isFinite(destLng) &&
    destLat >= -90 && destLat <= 90 &&
    destLng >= -180 && destLng <= 180
  ) {
    distanceKM = haversineDistance(warehouseLat, warehouseLng, destLat, destLng);
    hasValidDestination = true;
  }

  for (const item of cart.items) {
    const product = item.productId;
    if (!product) {
      throw new Error("Product in cart not found");
    }
    let unitPrice = product.price;

    // 1. Apply lot price rules
    if (product.pricePerLot?.length) {
      const lot = product.pricePerLot.find(
        p => item.quantity >= p.minQty && item.quantity <= p.maxQty
      );
      if (lot) unitPrice = lot.pricePerUnit;
    }

    const productCost = unitPrice * item.quantity;
    totalProductCost += productCost;

    // 2. Shipping calculations
    let shippingCost = 0;
    if (hasValidDestination && product.shippingPricePerKM?.length) {
      const slab = product.shippingPricePerKM.find(
        s => distanceKM >= s.minKM && distanceKM <= s.maxKM
      );
      if (!slab) {
        throw new Error(`Shipping not available to this destination for product: ${product.name}`);
      }
      shippingCost = slab.pricePerKM * distanceKM;
    }
    totalShippingCost += shippingCost;

    // 3. Packaging calculations
    let packagingCost = 0;
    if (packagingType && product.packagingOptions?.length) {
      const normalizedPackagingType = packagingType.toLowerCase();
      const pkg = product.packagingOptions.find(
        p => p.type.toLowerCase() === normalizedPackagingType
      );
      if (!pkg) {
        throw new Error(`Invalid packaging type: ${packagingType} for product: ${product.name}`);
      }
      const totalWeight = product.weight * item.quantity;
      const packagesByWeight = Math.ceil(totalWeight / pkg.maxWeightPerPackage);
      const packagesByItem = pkg.maxItemsPerPackage
        ? Math.ceil(item.quantity / pkg.maxItemsPerPackage)
        : 0;
      const packagesUsed = packagesByItem
        ? Math.max(packagesByWeight, packagesByItem)
        : packagesByWeight;
      packagingCost = packagesUsed * pkg.feePerPackage;
    }
    totalPackagingCost += packagingCost;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: unitPrice,
      quantity: item.quantity,
      image: product.images[0]?.url || "",
    });
  }

  const totalPrice = totalProductCost + totalShippingCost + totalPackagingCost;

  return {
    totalPrice,
    orderItems,
    itemsPrice: totalProductCost,
    shippingPrice: totalShippingCost,
    packagingPrice: totalPackagingCost,
    taxPrice: 0,
  };
};

module.exports = {
  haversineDistance,
  calculateCartPriceServerSide,
};
