export default function ProductCard({ product, onDelete, onEdit }) {
  const defaultImage = "https://via.placeholder.com/100x100?text=Product";

  // CHANGED: Build correct image URL for local uploads
  const imageSrc = product.image
    ? product.image.startsWith("/uploads/") // CHANGED
      ? `https://adminpro-server-n5dp.onrender.com${product.image}` // CHANGED
      : product.image // CHANGED
    : defaultImage; // CHANGED

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-center transition">
      <img
        src={imageSrc} // CHANGED: replaced product.image || defaultImage
        alt={product.name}
        className="w-full h-85 object-cover rounded mb-2 aspect-[3/2]"
      />
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-600">${product.price}</p>
      <p className={`text-sm mt-1 ${product.stock ? "text-green-600" : "text-red-600"}`}>
        {product.stock ? "In Stock" : "Out of Stock"}
      </p>

      {/* ✅ Show buttons only if props exist (so users without permissions won't see them) */}
      {(onEdit || onDelete) && (
        <div className="mt-3 flex gap-4">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
