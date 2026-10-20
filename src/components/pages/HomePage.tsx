import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle2,
  FolderDown,
  Layers,
  Heart,
  Tag,
  Dna,
  ShieldAlert,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { ProductViewer3D } from '../3d/ProductViewer3D.tsx';
import { ScienceHub } from '../science/ScienceHub.tsx';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    formatPrice,
    addToCart,
    setCurrentView,
    setSelectedProductSlug,
    setSelectedCategorySlug,
    toggleWishlist,
    isInWishlist,
    reviews,
  } = useShop();

  const featuredProducts = products.filter((p) => p.featured && p.status === 'active');
  const digitalProducts = products.filter((p) => p.type === 'digital' && p.status === 'active');
  const physicalProducts = products.filter((p) => p.type === 'physical' && p.status === 'active');

  const openProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
  };

  const openCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('category');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Next-Gen E-Commerce in Bangladesh • 2026 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Premium Shopping,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-emerald-300">
                Bangladeshi Pride
              </span>{' '}
              & Smart Innovations.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Discover authentic heritage apparel, precision laboratory instruments, flagship smart gadgets, and protected digital study bundles with official bKash, Nagad, and Google Drive delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('shop')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop All Products</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProductSlug('apex-portable-uv-spectrometer');
                  setCurrentView('product-detail');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-2 backdrop-blur-xs transition-colors"
              >
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Inspect 3D Spectrometer</span>
              </button>
            </div>

            {/* Quick reassurance tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Official bKash / Nagad</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Google Drive Digital Storage</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Cash on Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Hero Preview Right Column */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 rounded-3xl p-2 border border-slate-800 shadow-2xl">
              <ProductViewer3D
                productType="spectrometer"
                title="Apex 800 UV-Vis Lab Spectrophotometer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Featured Categories
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="hidden sm:flex items-center space-x-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => openCategory(cat.slug)}
              className="group text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {cat.productCount} items
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{cat.nameBn}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Promotional Coupon Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-800/60 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold">
                <Tag className="w-3.5 h-3.5" />
                <span>Special Promo Coupons</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Save up to 20% on Your First Order
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Apply active coupons during checkout for instant discounts. Works on both physical electronics and digital study materials!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="bg-slate-800/90 border border-teal-500/40 px-3.5 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-medium">15% Off (Min Tk 2,000)</span>
                <span className="text-sm font-mono font-bold text-teal-300">CODE: EID2026</span>
              </div>
              <div className="bg-slate-800/90 border border-sky-500/40 px-3.5 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Flat Tk 150 Off (Min Tk 1,000)</span>
                <span className="text-sm font-mono font-bold text-sky-300">CODE: WELCOME150</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending & Best-Selling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Trending & Best Sellers
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="flex items-center space-x-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const hasSale = product.salePrice && product.salePrice < product.regularPrice;
            const price = product.salePrice ?? product.regularPrice;
            const inWishlist = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/60 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => openProduct(product.slug)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        product.type === 'digital'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-900/90 text-white'
                      }`}
                    >
                      {product.type === 'digital' ? 'Instant Digital' : 'Physical'}
                    </span>

                    {product.has3DModel && (
                      <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <Layers className="w-2.5 h-2.5" />
                        <span>3D View</span>
                      </span>
                    )}
                  </div>

                  {/* Wishlist Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
                      inWishlist
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-slate-800">{product.rating}</span>
                      <span className="text-slate-400">({product.reviewCount})</span>
                    </div>

                    <h3
                      onClick={() => openProduct(product.slug)}
                      className="font-bold text-sm text-slate-900 hover:text-teal-700 transition-colors line-clamp-2 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          {formatPrice(price)}
                        </span>
                        {hasSale && (
                          <span className="text-xs text-slate-400 line-through font-mono">
                            {formatPrice(product.regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className="p-2.5 bg-slate-900 hover:bg-teal-600 text-white rounded-xl transition-colors active:scale-95 shadow-sm"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DeepMind Science & Open Research Hub Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScienceHub onSelectProduct={openProduct} />
      </section>

      {/* 6. Digital Library Section Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-full text-xs font-semibold">
              <FolderDown className="w-3.5 h-3.5" />
              <span>Instant Digital Delivery • Cloud Security</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Official Digital E-Books, Revision Bundles & Research Tools
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              No delivery waiting time! Purchase digital textbooks, Cambridge bioscience notes, or developer code guides and download them immediately from your <strong>My Digital Library</strong> account or back them up directly to your personal Google Drive with a single click.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategorySlug('digital-products');
                  setCurrentView('category');
                }}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
              >
                <span>Browse All Digital Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('digital-library')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs border border-slate-700 transition-colors"
              >
                Access My Digital Library
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Genuine Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
            Verified Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Loved Across Bangladesh
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Real reviews submitted by verified buyers from Dhaka, Chittagong, Sylhet, and Rajshahi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">{rev.userName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                {rev.verifiedPurchase && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
