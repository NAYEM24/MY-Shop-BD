import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { buildWhatsAppUrl, formatToWhatsAppPhone } from '../../utils/whatsapp.ts';

export const WhatsAppLiveWidget: React.FC = () => {
  const { storeSettings, language } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const rawPhone = storeSettings.whatsappNumber || '01940320627';
  const displayPhone = '+880 ' + rawPhone.replace(/\D/g, '').replace(/^880/, '').replace(/^0/, '0');

  const handleStartChat = (message: string) => {
    const url = buildWhatsAppUrl(rawPhone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  const quickPrompts = [
    {
      label: language === 'bn' ? 'অর্ডার ট্র্যাক করতে চাই' : 'Track My Order',
      icon: Truck,
      msg:
        language === 'bn'
          ? 'আসসালামু আলাইকুম, আমি আমার অর্ডারের ডেলিভারি স্ট্যাটাস ট্র্যাক করতে চাই।'
          : 'Hello, I would like to track my order status.',
    },
    {
      label: language === 'bn' ? 'বিকাশ / নগদ পেমেন্ট সহায়তা' : 'Payment Assistance',
      icon: CreditCard,
      msg:
        language === 'bn'
          ? 'আসসালামু আলাইকুম, বিকাশ বা নগদ পেমেন্ট সংক্রান্ত বিষয়ে আমার সহায়তা প্রয়োজন।'
          : 'Hello, I need assistance with bKash / Nagad payment verification.',
    },
    {
      label: language === 'bn' ? 'পণ্য ও ডিসকাউন্ট তথ্য' : 'Product & Offer Inquiry',
      icon: ShoppingBag,
      msg:
        language === 'bn'
          ? 'আসসালামু আলাইকুম, আপনাদের শপের পণ্য এবং বর্তমান অফার সম্পর্কে জানতে চাচ্ছি।'
          : 'Hello, I have an inquiry regarding product specifications and current deals.',
    },
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 select-none">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[310px] sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#25D366] shrink-0 shadow-xs">
                <MessageCircle className="w-6 h-6 fill-[#25D366]" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight">
                  {language === 'bn' ? 'MY SHOP BD লাইভ সাপোর্ট' : 'MY SHOP BD Live Support'}
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" />
                  <span>
                    {language === 'bn' ? 'অনলাইন • ৫ মিনিটে রিপ্লাই' : 'Online • Replies in minutes'}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#E5DDD5]/30">
            {/* Chat bubble message */}
            <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs text-slate-800 space-y-1 border border-slate-100">
              <p className="font-semibold text-slate-900">
                {language === 'bn'
                  ? 'আসসালামু আলাইকুম! আপনাকে কীভাবে সাহায্য করতে পারি?'
                  : 'Hello! Welcome to MY SHOP BD. How can we assist you today?'}
              </p>
              <p className="text-[11px] text-slate-500">
                WhatsApp: <span className="font-mono font-bold text-teal-800">{rawPhone}</span>
              </p>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'bn' ? 'দ্রুত প্রশ্ন সিলেক্ট করুন:' : 'Quick Questions:'}
              </span>
              {quickPrompts.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => handleStartChat(q.msg)}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all group shadow-2xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Icon className="w-3.5 h-3.5 text-teal-600 group-hover:text-emerald-600 shrink-0" />
                      <span className="truncate">{q.label}</span>
                    </div>
                    <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Custom Message Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStartChat(
                  customMsg.trim() ||
                    (language === 'bn'
                      ? 'আসসালামু আলাইকুম, আমার কিছু তথ্য প্রয়োজন।'
                      : 'Hello MY SHOP BD support, I need assistance.')
                );
              }}
              className="pt-2 flex items-center space-x-1.5"
            >
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={
                  language === 'bn' ? 'আপনার মেসেজ লিখুন...' : 'Type your message...'
                }
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] text-slate-800 placeholder-slate-400 shadow-2xs"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold rounded-xl shadow-md transition-all active:scale-95"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
        aria-label="Open WhatsApp Live Support"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366] shrink-0" />

        {/* Desktop Text Label */}
        <span className="hidden sm:inline font-black text-xs text-slate-950 tracking-tight">
          {language === 'bn' ? 'হোয়াটসঅ্যাপ সাপোর্ট' : 'Live WhatsApp'}
        </span>

        {/* Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white" />
        </span>
      </button>
    </div>
  );
};
