import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Share2,
  FileText,
  Dna,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FolderDown,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { ProductViewer3D } from '../3d/ProductViewer3D.tsx';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductSlug,
    setCurrentView,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    user,
    setSelectedProductSlug,
    showToast,
  } = useShop();

  const product = products.find((p) => p.slug === selectedProductSlug) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'photos' | '3d'>('photos');
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const basePrice = product.salePrice ?? product.regularPrice;
  const currentPrice = selectedVariant ? basePrice + selectedVariant.priceDelta : basePrice;
  const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
  const inWishlist = isInWishlist(product.id);

  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.status === 'active')
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariantId);
    setCurrentView('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter your review comments.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    addReview({
      productId: product.id,
      userId: user?.uid || 'guest_user',
      userName: user?.displayName || 'Customer',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Visual Media Gallery or 3D Model */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mode Tabs (Photos vs 3D) if product supports 3D */}
          {product.has3DModel && (
            <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'photos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Photo Gallery
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('3d')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  activeTab === '3d'
                    ? 'bg-slate-900 text-teal-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>Interactive 3D Inspector</span>
              </button>
            </div>
          )}

          {activeTab === '3d' && product.has3DModel ? (
            <ProductViewer3D
              productType={product.model3DType || 'spectrometer'}
              title={product.name}
            />
          ) : (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    product.type === 'digital'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-900/90 text-white'
                  }`}
                >
                  {product.type === 'digital' ? 'Digital Download (PDF)' : 'Physical Product'}
                </span>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-teal-600 ring-2 ring-teal-500/20'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Product Actions & Metadata */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category badge */}
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              {product.subcategory || product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-snug">
              {product.name}
            </h1>

            {product.nameBn && (
              <p className="text-xs text-slate-500 mt-0.5">{product.nameBn}</p>
            )}

            {/* Ratings & SKU */}
            <div className="flex items-center space-x-3 mt-3 text-xs">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-slate-900">{product.rating}</span>
                <span className="text-slate-500">({product.reviewCount} customer reviews)</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-500">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Total Price:</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {formatPrice(currentPrice)}
                </span>
                {product.salePrice && product.salePrice < product.regularPrice && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {formatPrice(product.regularPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="text-right">
              {product.type === 'physical' ? (
                maxStock > 0 ? (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    In Stock ({maxStock} units)
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Out of Stock
                  </span>
                )
              ) : (
                <span className="inline-flex items-center text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Instant Cloud Download
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Select Variant:</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-3 py-2 text-xs rounded-xl border font-semibold transition-all ${
                      selectedVariantId === v.id
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{v.name}</span>
                    {v.priceDelta !== 0 && (
                      <span className="ml-1 text-[10px] text-slate-500 font-mono">
                        ({v.priceDelta > 0 ? `+Tk ${v.priceDelta}` : `-Tk ${Math.abs(v.priceDelta)}`})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity, selectedVariantId)}
                disabled={product.type === 'physical' && maxStock <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-500'
                    : 'border-slate-200 text-slate-600 hover:text-rose-500'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.type === 'physical' && maxStock <= 0}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white font-extrabold text-xs transition-all shadow-md active:scale-95"
            >
              Buy Now with Instant bKash / Nagad / COD
            </button>
          </div>

          {/* Delivery & Reassurance Specs */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center space-x-2.5">
              <Truck className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>
                <strong>Delivery in Bangladesh:</strong> Inside Dhaka (24-48h, Tk 60), Outside Dhaka (3-5 days, Tk 120).
              </span>
            </div>
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>100% Genuine Guaranteed:</strong> Official merchant warranty & verified origin.
              </span>
            </div>
            <div className="flex items-center space-x-2.5">
              <RotateCcw className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span>
                <strong>7-Day Return Policy:</strong> Easy exchange or refund for defective physical items.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Scientific / Digital Metadata */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Product Specifications & Technical Data
        </h3>

        {product.specifications && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-medium text-slate-500">{key}</span>
                <span className="font-semibold text-slate-900 text-right">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Science Metadata Box if present */}
        {product.scienceMetadata && (
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2 text-xs text-blue-900">
            <div className="flex items-center space-x-2 font-bold text-blue-950">
              <Dna className="w-4 h-4 text-blue-700" />
              <span>Bioscience Research & Citation Info</span>
            </div>
            {product.scienceMetadata.scientificDomain && (
              <p>Domain: <span className="font-semibold">{product.scienceMetadata.scientificDomain}</span></p>
            )}
            {product.scienceMetadata.uniprotOrPdbId && (
              <p>UniProt / PDB Assay Target: <span className="font-mono font-bold">{product.scienceMetadata.uniprotOrPdbId}</span></p>
            )}
            {product.scienceMetadata.doiReference && (
              <p>Authoritative DOI: <span className="font-mono">{product.scienceMetadata.doiReference}</span></p>
            )}
          </div>
        )}

        {/* Digital Product Delivery Notice */}
        {product.digitalMetadata && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2 text-xs text-teal-900">
            <div className="flex items-center space-x-2 font-bold text-teal-950">
              <FolderDown className="w-4 h-4 text-teal-700" />
              <span>Digital Delivery & Cloud Security</span>
            </div>
            <p>
              Purchased file: <span className="font-mono font-semibold">{product.digitalMetadata.fileName}</span> ({Math.round(product.digitalMetadata.fileSizeBytes / 1000000)} MB)
            </p>
            <p>
              Version: {product.digitalMetadata.version} • Download limit: {product.digitalMetadata.downloadLimit} downloads per verified purchase.
            </p>
            <p className="text-[11px] text-teal-700">
              Backed up securely with one click to your <strong>Google Drive</strong> from the My Digital Library dashboard.
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews & Submit Review Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Customer Ratings & Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on genuine submitted customer feedback
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-base font-extrabold text-slate-900">{product.rating} / 5</span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">
              No reviews yet for this product. Be the first to share your thoughts below!
            </p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-slate-100 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>Write a Customer Review</span>
          </h4>

          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-1">Rating:</span>
            <div className="flex space-x-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Your Feedback:
            </label>
            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was the product quality, delivery speed, and customer service?"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="px-5 py-2.5 bg-slate-900 hover:bg-teal-600 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Submit Verified Review
          </button>
        </form>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-bold text-slate-900">Customers Also Viewed</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  setSelectedProductSlug(rel.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 line-clamp-2">
                    {rel.name}
                  </h4>
                  <span className="text-sm font-extrabold text-slate-900 font-mono mt-2 block">
                    {formatPrice(rel.salePrice ?? rel.regularPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
