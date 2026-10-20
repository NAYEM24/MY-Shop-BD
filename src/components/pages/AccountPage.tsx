import React, { useState } from 'react';
import {
  User,
  MapPin,
  Box,
  FolderDown,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { BANGLADESH_DIVISIONS } from '../../data/mockDatabase.ts';
import { ShippingAddress } from '../../types/index.ts';

export const AccountPage: React.FC = () => {
  const {
    user,
    orders,
    digitalEntitlements,
    setCurrentView,
    setSelectedOrderId,
    formatPrice,
    updateProfile,
    logout,
    loginWithDemo,
  } = useShop();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address add form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    phone: user?.phone || '',
    division: 'Dhaka',
    district: 'Dhaka',
    upazilaOrArea: '',
    streetAddress: '',
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Please Sign In to Access Your Account</h2>
        <p className="text-xs text-slate-500">
          Sign in to view your orders, saved addresses, and unlocked digital library files.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Go to Login
          </button>
          <button
            type="button"
            onClick={() => loginWithDemo('customer')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
          >
            Instant Demo Customer Login
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ displayName, phone });
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...(user.savedAddresses || []), newAddress];
    updateProfile({ savedAddresses: updated });
    setShowAddAddress(false);
    setNewAddress({
      fullName: user.displayName,
      phone: user.phone || '',
      division: 'Dhaka',
      district: 'Dhaka',
      upazilaOrArea: '',
      streetAddress: '',
    });
  };

  const handleDeleteAddress = (index: number) => {
    const updated = (user.savedAddresses || []).filter((_, i) => i !== index);
    updateProfile({ savedAddresses: updated });
  };

  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('order-detail');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-900 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-sm">
            {user.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.displayName}</h1>
              {user.role === 'admin' && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-600 mt-0.5">Phone: {user.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form Modal/Drawer */}
      {isEditingProfile && (
        <form onSubmit={handleProfileSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Update Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Two Column Grid: Recent Orders + Saved Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Box className="w-4 h-4 text-teal-600" />
              <span>Order History ({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No orders placed yet.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => openOrderDetail(ord.id)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500/70 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          ord.fulfillmentStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.fulfillmentStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.fulfillmentStatus === 'processing'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.fulfillmentStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Placed on: {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                    <span className="font-mono font-extrabold text-sm text-slate-900">
                      {formatPrice(ord.totalAmount)}
                    </span>
                    <span className="text-xs text-teal-700 font-semibold flex items-center space-x-1">
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Saved Delivery Addresses */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Saved Delivery Addresses</span>
            </h2>

            <button
              type="button"
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="text-xs text-teal-700 font-bold flex items-center space-x-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Add New Address in Bangladesh</h4>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Division</label>
                <select
                  value={newAddress.division}
                  onChange={(e) => {
                    const div = e.target.value;
                    const districts = BANGLADESH_DIVISIONS[div] || [];
                    setNewAddress({ ...newAddress, division: div, district: districts[0] || '' });
                  }}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  {Object.keys(BANGLADESH_DIVISIONS).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">District</label>
                <select
                  value={newAddress.district}
                  onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  {(BANGLADESH_DIVISIONS[newAddress.division] || []).map((dst) => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="House, road, sector..."
                  value={newAddress.streetAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-bold text-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {(user.savedAddresses || []).map((addr, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900 block">{addr.fullName}</span>
                  <p className="mt-0.5">{addr.streetAddress}</p>
                  <p>{addr.upazilaOrArea ? `${addr.upazilaOrArea}, ` : ''}{addr.district}, {addr.division}</p>
                  <p className="font-mono text-slate-500 mt-1">Phone: {addr.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(idx)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
