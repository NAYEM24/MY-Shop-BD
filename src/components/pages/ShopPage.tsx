import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Star,
  ShoppingBag,
  Heart,
  Layers,
  X,
  ArrowUpDown,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { ProductType } from '../../types/index.ts';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    formatPrice,
    addToCart,
    setCurrentView,
    setSelectedProductSlug,
    selectedCategorySlug,
    setSelectedCategorySlug,
    toggleWishlist,
    isInWishlist,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [selectedType, setSelectedType] = useState<'all' | ProductType>('all');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== 'active') return false;

      // Category filter
      if (selectedCategorySlug && p.category !== selectedCategorySlug) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && p.type !== selectedType) {
        return false;
      }

      // Price filter
      const price = p.salePrice ?? p.regularPrice;
      if (price > maxPrice) {
        return false;
      }

      // Stock filter
      if (inStockOnly && p.type === 'physical' && p.stock <= 0) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.regularPrice;
      const priceB = b.salePrice ?? b.regularPrice;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.featured ? 1 : -1;
    });
  }, [products, selectedCategorySlug, selectedType, maxPrice, inStockOnly, sortBy, searchQuery]);

  const openProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
  };

  const clearAllFilters = () => {
    setSelectedCategorySlug(null);
    setSelectedType('all');
    setMaxPrice(30000);
    setInStockOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {selectedCategorySlug
              ? categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Category Products'
              : searchQuery
              ? `Search Results for "${searchQuery}"`
              : 'All Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredProducts.length} items available in Bangladesh
          </p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center space-x-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Filter className="w-4 h-4 text-teal-600" />
                <span>Filter By</span>
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-teal-600 hover:underline font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">Category</span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategorySlug(null)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex justify-between ${
                    selectedCategorySlug === null
                      ? 'bg-teal-50 font-bold text-teal-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategorySlug(c.slug)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex justify-between ${
                      selectedCategorySlug === c.slug
                        ? 'bg-teal-50 font-bold text-teal-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{c.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Type */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">Format</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedType('all')}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-medium border text-center transition-colors ${
                    selectedType === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('physical')}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-medium border text-center transition-colors ${
                    selectedType === 'physical'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Physical
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('digital')}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-medium border text-center transition-colors ${
                    selectedType === 'digital'
                      ? 'bg-sky-700 text-white border-sky-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Digital
                </button>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-800">Max Price</span>
                <span className="text-xs font-mono font-bold text-teal-700">
                  Tk {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="30000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Tk 500</span>
                <span>Tk 30,000+</span>
              </div>
            </div>

            {/* In-stock Only */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>In-Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Try adjusting your search filters, price limits, or clearing category restrictions.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const hasSale = product.salePrice && product.salePrice < product.regularPrice;
                const price = product.salePrice ?? product.regularPrice;
                const inWishlist = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/60 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Image & Tags */}
                    <div
                      className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
                      onClick={() => openProduct(product.slug)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

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
          )}
        </main>
      </div>
    </div>
  );
};
