import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    setCurrentView,
    setSelectedProductSlug,
  } = useShop();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Save your favorite products to your wishlist so you can revisit and purchase them anytime.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">{wishlistProducts.length} items saved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => {
          const price = product.salePrice ?? product.regularPrice;

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden"
            >
              <div
                className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
                onClick={() => {
                  setSelectedProductSlug(product.slug);
                  setCurrentView('product-detail');
                }}
              >
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => {
                      setSelectedProductSlug(product.slug);
                      setCurrentView('product-detail');
                    }}
                    className="font-bold text-xs text-slate-900 hover:text-teal-700 line-clamp-2 cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <span className="font-extrabold font-mono text-sm text-slate-900 block mt-2">
                    {formatPrice(price)}
                  </span>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="w-full py-2 bg-slate-900 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
