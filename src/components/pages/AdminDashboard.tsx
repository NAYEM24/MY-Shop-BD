import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Settings,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Download,
  Filter,
  Search,
  Lock,
  Layers,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import {
  FulfillmentStatus,
  PaymentStatus,
  Product,
  ProductStatus,
  ProductType,
} from '../../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    categories,
    reviews,
    moderateReview,
    storeSettings,
    updateStoreSettings,
    formatPrice,
    isAdmin,
    setCurrentView,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'reviews' | 'reports' | 'settings'
  >('overview');

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for creating/editing products
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('electronics');
  const [pType, setPType] = useState<ProductType>('physical');
  const [pPrice, setPPrice] = useState(1500);
  const [pSalePrice, setPSalePrice] = useState<number | undefined>(undefined);
  const [pSku, setPSku] = useState('');
  const [pStock, setPStock] = useState(25);
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');
  const [pHas3D, setPHas3D] = useState(false);
  const [p3DType, setP3DType] = useState<'spectrometer' | 'earbuds' | 'smartwatch'>('spectrometer');

  // Order fulfillment edit state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [carrierName, setCarrierName] = useState('Pathao Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  // Guard: Admin authorization check
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Restricted</h2>
        <p className="text-xs text-slate-500">
          You must be an authorized MY SHOP BD administrator with custom security privileges to view this portal.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView('admin-login')}
          className="px-5 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  // Dashboard Overview Metrics
  const totalOrders = orders.length;
  const verifiedSales = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'pending_payment' || o.fulfillmentStatus === 'processing'
  ).length;
  const lowStockProducts = products.filter((p) => p.type === 'physical' && p.stock <= 5);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setPName('');
    setPCategory('electronics');
    setPType('physical');
    setPPrice(1500);
    setPSalePrice(undefined);
    setPSku(`MSBD-SKU-${Math.floor(100 + Math.random() * 900)}`);
    setPStock(25);
    setPDescription('');
    setPImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80');
    setPHas3D(false);
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPCategory(product.category);
    setPType(product.type);
    setPPrice(product.regularPrice);
    setPSalePrice(product.salePrice);
    setPSku(product.sku);
    setPStock(product.stock);
    setPDescription(product.description);
    setPImage(product.images[0] || '');
    setPHas3D(Boolean(product.has3DModel));
    setP3DType(product.model3DType || 'spectrometer');
    setShowProductModal(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    const slug = pName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const now = new Date().toISOString();

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: pName,
        category: pCategory,
        type: pType,
        regularPrice: pPrice,
        salePrice: pSalePrice,
        sku: pSku,
        stock: pStock,
        description: pDescription,
        images: [pImage],
        has3DModel: pHas3D,
        model3DType: pHas3D ? p3DType : undefined,
        updatedAt: now,
      });
    } else {
      addProduct({
        id: 'prod_' + Date.now().toString(),
        slug,
        name: pName,
        category: pCategory,
        subcategory: pCategory,
        type: pType,
        regularPrice: pPrice,
        salePrice: pSalePrice,
        sku: pSku,
        stock: pType === 'physical' ? pStock : 9999,
        description: pDescription,
        images: [pImage],
        status: 'active',
        featured: false,
        tags: [pCategory, pType],
        rating: 5.0,
        reviewCount: 0,
        has3DModel: pHas3D,
        model3DType: pHas3D ? p3DType : undefined,
        digitalMetadata:
          pType === 'digital'
            ? {
                fileId: 'file_' + Date.now().toString(),
                fileName: `${slug}_official.pdf`,
                fileSizeBytes: 12500000,
                mimeType: 'application/pdf',
                version: '1.0',
                downloadLimit: 5,
                storagePath: `protected/digital/${slug}.pdf`,
              }
            : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    setShowProductModal(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(settingsForm);
  };

  const exportOrdersCSV = () => {
    const headers = ['Order Number,Date,Customer,Email,Phone,Total (BDT),Payment Method,Payment Status,Fulfillment Status\n'];
    const rows = orders.map(
      (o) =>
        `"${o.orderNumber}","${new Date(o.createdAt).toLocaleDateString()}","${o.shippingAddress.fullName}","${o.userEmail}","${o.userPhone}",${o.totalAmount},"${o.paymentMethod}","${o.paymentStatus}","${o.fulfillmentStatus}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MY_SHOP_BD_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Orders report downloaded as CSV!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Store Administrator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">MY SHOP BD Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fulfillment, inventory audits, bKash & Nagad configuration, and report exports.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={openAddProductModal}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            type="button"
            onClick={exportOrdersCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold text-slate-600">
        {[
          { key: 'overview', label: 'Overview', icon: LayoutDashboard },
          { key: 'products', label: 'Products', icon: Package },
          { key: 'orders', label: 'Orders & Shipping', icon: ShoppingBag },
          { key: 'reviews', label: 'Reviews Moderation', icon: Star },
          { key: 'settings', label: 'Store & Payment Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Verified Sales</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatPrice(verifiedSales)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block pt-1">
                From paid bKash, Nagad & orders
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Orders Placed</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{totalOrders}</div>
              <span className="text-[11px] text-slate-500 block pt-1">Across all 8 divisions</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Pending Fulfillment</span>
              <div className="text-2xl font-extrabold text-amber-600 font-mono">{pendingOrders}</div>
              <span className="text-[11px] text-amber-700 font-semibold block pt-1">
                Awaiting packing / courier pickup
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Low Stock Alerts (&le;5)</span>
              <div className="text-2xl font-extrabold text-rose-600 font-mono">
                {lowStockProducts.length}
              </div>
              <span className="text-[11px] text-rose-600 font-semibold block pt-1">
                Restock required soon
              </span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5">Order</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-medium text-slate-800">{ord.shippingAddress.fullName}</td>
                      <td className="py-3 font-mono font-bold text-slate-900">{formatPrice(ord.totalAmount)}</td>
                      <td className="py-3 uppercase text-[10px] font-bold text-slate-600">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full capitalize font-semibold">
                          {ord.fulfillmentStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">All Products Catalog ({products.length})</h3>
            <button
              type="button"
              onClick={openAddProductModal}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Stock</th>
                  <th className="py-2.5">3D Model</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 flex items-center space-x-2.5">
                      <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-50" />
                      <div>
                        <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{p.category}</span>
                      </div>
                    </td>
                    <td className="py-3 capitalize text-[11px] font-semibold">
                      <span className={p.type === 'digital' ? 'text-sky-700' : 'text-slate-700'}>
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-500">{p.sku}</td>
                    <td className="py-3 font-mono font-bold text-slate-900">
                      {formatPrice(p.salePrice ?? p.regularPrice)}
                    </td>
                    <td className="py-3">
                      {p.type === 'physical' ? (
                        <span
                          className={`font-mono font-bold ${
                            p.stock <= 5 ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {p.stock}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">Digital</span>
                      )}
                    </td>
                    <td className="py-3">
                      {p.has3DModel ? (
                        <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Enabled
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditProductModal(p)}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & SHIPPING FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Fulfillment & Tracking
          </h3>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div>
                    <span className="font-mono font-extrabold text-sm text-slate-900 block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-slate-500">
                      Customer: <strong>{ord.shippingAddress.fullName}</strong> • {ord.shippingAddress.district},{' '}
                      {ord.shippingAddress.division} ({ord.userPhone})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-sm text-slate-900">
                      {formatPrice(ord.totalAmount)}
                    </span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Fulfillment Status Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 font-semibold">Status:</span>
                    <select
                      value={ord.fulfillmentStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as FulfillmentStatus)}
                      className="p-1.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(ord.id, ord.fulfillmentStatus, 'paid')}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                    >
                      Mark Paid
                    </button>
                  </div>

                  {/* Audit Trail Note */}
                  <span className="text-[10px] text-slate-400">
                    Latest event: {ord.auditLogs[ord.auditLogs.length - 1]?.action || 'Created'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Customer Reviews Moderation ({reviews.length})
          </h3>

          <div className="space-y-3 text-xs">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="text-amber-500 font-bold">{rev.rating} ★</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-1 italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center space-x-2">
                  {rev.status === 'approved' ? (
                    <button
                      type="button"
                      onClick={() => moderateReview(rev.id, 'hidden')}
                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-[10px] font-bold"
                    >
                      Hide Review
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => moderateReview(rev.id, 'approved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STORE & PAYMENT SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Store, Delivery & Payment Gateway Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Store Name</label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hotline Phone</label>
              <input
                type="text"
                value={settingsForm.contactPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Inside Dhaka Shipping Fee (BDT)</label>
              <input
                type="number"
                value={settingsForm.insideDhakaShippingFee}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, insideDhakaShippingFee: parseInt(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Outside Dhaka Shipping Fee (BDT)</label>
              <input
                type="number"
                value={settingsForm.outsideDhakaShippingFee}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, outsideDhakaShippingFee: parseInt(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Free Shipping Threshold (BDT)</label>
              <input
                type="number"
                value={settingsForm.freeShippingThreshold}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, freeShippingThreshold: parseInt(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">bKash Merchant Wallet Number</label>
              <input
                type="text"
                value={settingsForm.bkashMerchantNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, bkashMerchantNumber: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nagad Merchant Wallet Number</label>
              <input
                type="text"
                value={settingsForm.nagadMerchantNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, nagadMerchantNumber: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="testModeCheck"
                checked={settingsForm.isPaymentTestMode}
                onChange={(e) => setSettingsForm({ ...settingsForm, isPaymentTestMode: e.target.checked })}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="testModeCheck" className="font-semibold text-slate-800 cursor-pointer">
                Enable Payment Test Mode (Allow simulated bKash/Nagad transactions)
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleProductSubmit}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              {editingProduct ? 'Edit Product' : 'Add New Product to MY SHOP BD'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Apex Precision UV-Vis Spectrometer"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Product Type</label>
                <select
                  value={pType}
                  onChange={(e) => setPType(e.target.value as ProductType)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option value="physical">Physical Product</option>
                  <option value="digital">Digital Product (PDF/Code)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Regular Price (BDT)</label>
                <input
                  type="number"
                  required
                  value={pPrice}
                  onChange={(e) => setPPrice(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Sale Price (Optional BDT)</label>
                <input
                  type="number"
                  value={pSalePrice || ''}
                  onChange={(e) =>
                    setPSalePrice(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">SKU</label>
                <input
                  type="text"
                  required
                  value={pSku}
                  onChange={(e) => setPSku(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  disabled={pType === 'digital'}
                  value={pStock}
                  onChange={(e) => setPStock(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono disabled:opacity-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              {/* 3D Model Configuration */}
              <div className="sm:col-span-2 flex items-center space-x-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pHas3D}
                    onChange={(e) => setPHas3D(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600"
                  />
                  <span className="font-bold text-slate-800">Enable Three.js 3D Inspector</span>
                </label>

                {pHas3D && (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Model Type:</span>
                    <select
                      value={p3DType}
                      onChange={(e) => setP3DType(e.target.value as any)}
                      className="p-1.5 bg-white border rounded-lg text-xs"
                    >
                      <option value="spectrometer">Lab UV-Vis Spectrometer</option>
                      <option value="earbuds">ANC Wireless Earbuds</option>
                      <option value="smartwatch">AMOLED Smartwatch</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl shadow-sm"
              >
                {editingProduct ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
