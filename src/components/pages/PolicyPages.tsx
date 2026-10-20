import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

interface PolicyPagesProps {
  pageType:
    | 'policy-shipping'
    | 'policy-return'
    | 'policy-privacy'
    | 'policy-terms'
    | 'faq'
    | 'about'
    | 'contact';
}

export const PolicyPages: React.FC<PolicyPagesProps> = ({ pageType }) => {
  const { setCurrentView, showToast } = useShop();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    showToast('Your inquiry has been submitted! Our Dhaka support team will reply within 4 hours.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. SHIPPING POLICY */}
      {pageType === 'policy-shipping' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 text-teal-700">
            <Truck className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Shipping & Delivery Policy
            </h1>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              At <strong>MY SHOP BD</strong>, we are committed to delivering your products across all 64 districts of Bangladesh swiftly and safely. We partner with premier nationwide courier networks (including Pathao Courier, Steadfast Logistics, and RedX).
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-2">1. Delivery Charges & Timelines</h3>
            <ul className="list-disc list-inside space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <li>
                <strong>Inside Dhaka City:</strong> Delivery fee is <strong>৳60 BDT</strong>. Orders placed before 1:00 PM are dispatched same-day and typically delivered within 24 to 48 hours.
              </li>
              <li>
                <strong>Outside Dhaka (All Other 63 Districts):</strong> Delivery fee is <strong>৳120 BDT</strong>. Delivery timeline is 3 to 5 business days.
              </li>
              <li>
                <strong>Free Delivery Offer:</strong> Any order containing physical goods with a subtotal of <strong>৳3,000 BDT or higher</strong> automatically qualifies for 100% FREE delivery anywhere in Bangladesh!
              </li>
              <li>
                <strong>Digital Products:</strong> Digital e-books, Cambridge study packs, and genomics kits incur <strong>৳0 delivery charge</strong> and are accessible immediately upon payment verification from your <em>My Digital Library</em> account.
              </li>
            </ul>

            <h3 className="text-sm font-bold text-slate-900 pt-2">2. Order Tracking</h3>
            <p>
              Once your parcel is dispatched from our central warehouse in Gulshan, Dhaka, an SMS with your unique courier tracking number will be sent to your registered Bangladeshi mobile phone number.
            </p>
          </div>
        </div>
      )}

      {/* 2. RETURN & REFUND POLICY */}
      {pageType === 'policy-return' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 text-sky-700">
            <RotateCcw className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Return & Refund Policy
            </h1>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Customer trust and satisfaction are our utmost priorities. We offer a transparent, reliable return and exchange process for all eligible purchases in Bangladesh.
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-2">1. 7-Day Return Guarantee for Physical Items</h3>
            <p>
              If a physical product received is damaged, functionally defective, incorrect, or mismatched with our online specifications, you may request an exchange or full refund within <strong>7 days</strong> of delivery.
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-2">2. Refund Processing</h3>
            <p>
              Refunds are processed back to your original payment source (bKash wallet, Nagad wallet, or bank account) within <strong>3 to 5 business days</strong> after the returned item is inspected at our Dhaka facility.
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-2">3. Digital Product Policy</h3>
            <p>
              Due to the nature of digital goods, downloads and PDF access cannot be returned once downloaded. However, if a file is technically corrupted or mismatched, our engineering team will promptly issue a corrected version or revoke access and issue a full refund upon verification.
            </p>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY */}
      {pageType === 'policy-privacy' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 text-emerald-700">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              MY SHOP BD values your personal privacy. We never sell, lease, or share customer contact details or purchase histories with unauthorized third parties.
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-2">1. Payment Security & Zero PIN Storage</h3>
            <p>
              When you pay using <strong>bKash</strong> or <strong>Nagad</strong>, you complete payments directly via the official merchant interfaces. <strong>We NEVER request, process, or store your bKash/Nagad PINs or OTPs on our servers.</strong>
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-2">2. Google Workspace & Drive Permissions</h3>
            <p>
              When you choose to back up digital purchases or order invoices to your Google Drive, our app requests only the least-privilege <code>drive.file</code> scope. This grants permission only to files created by MY SHOP BD. We cannot view, access, or modify your existing personal documents or photos.
            </p>
          </div>
        </div>
      )}

      {/* 4. TERMS AND CONDITIONS */}
      {pageType === 'policy-terms' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 text-slate-800">
            <FileText className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Terms & Conditions
            </h1>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Welcome to MY SHOP BD. By browsing our catalog or placing an order, you agree to comply with and be bound by the following terms, operated in accordance with the laws of the People's Republic of Bangladesh.
            </p>
            <h3 className="text-sm font-bold text-slate-900 pt-2">1. Product Pricing & Currency</h3>
            <p>
              All prices displayed on MY SHOP BD are in <strong>Bangladeshi Taka (BDT)</strong>. Prices are inclusive of applicable VAT.
            </p>
            <h3 className="text-sm font-bold text-slate-900 pt-2">2. Digital Product License</h3>
            <p>
              Digital textbooks and educational software downloads are provided under a single-user personal license. Commercial redistribution, re-hosting, or public file-sharing is strictly prohibited.
            </p>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {pageType === 'faq' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 text-amber-700">
            <HelpCircle className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions (FAQ)
            </h1>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            {[
              {
                q: 'How do I pay with bKash or Nagad on MY SHOP BD?',
                a: 'During checkout, select bKash or Nagad. You will be provided with our official merchant number. Send the exact order amount using "Make Payment" or "Merchant Pay", then enter your received Transaction ID (TrxID) in the checkout box.',
              },
              {
                q: 'How does the Google Drive integration work?',
                a: 'When you purchase any digital book or complete an order, you can click "Save Invoice to Google Drive" or "Save to Drive" in your Digital Library. The app will securely upload your file to a dedicated folder in your personal Drive account.',
              },
              {
                q: 'What is the Three.js 3D Product Inspector?',
                a: 'For select flagship products like our Apex UV-Vis Spectrometer and ANC Earbuds, you can toggle the "Interactive 3D Inspector" on the product detail page to rotate, zoom, inspect exploded internal parts, and toggle finishes in real-time.',
              },
              {
                q: 'How long does physical delivery take outside Dhaka?',
                a: 'Shipments outside Dhaka to divisions like Chittagong, Sylhet, Rajshahi, or Khulna take approximately 3 to 5 business days via Steadfast or Pathao logistics.',
              },
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900">{faq.q}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ABOUT US */}
      {pageType === 'about' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">About MY SHOP BD</h1>
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Founded in Dhaka, <strong>MY SHOP BD</strong> was built to elevate e-commerce in Bangladesh to world-class standards. We bridge physical retail craftsmanship with cutting-edge digital products, high-end laboratory gear, and modern web graphics.
            </p>
            <p>
              From handloom Tangail cotton weavers and tea estates in Sreemangal to university biochemistry researchers needing UV-Vis spectrometers and students learning computational genomics, our mission is to deliver authentic excellence with local payment convenience.
            </p>
          </div>
        </div>
      )}

      {/* 7. CONTACT US */}
      {pageType === 'contact' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Contact Us</h1>
          <p className="text-xs text-slate-500">
            Have a question about an order, physical delivery, or digital download? Reach out to our Dhaka support team.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <Phone className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-slate-900 block">Phone Hotline</span>
              <span className="text-slate-600">+880 1711-000999</span>
              <span className="text-[10px] text-slate-400 block">Daily 9 AM - 10 PM BST</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <Mail className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-slate-900 block">Email Support</span>
              <span className="text-slate-600">support@myshopbd.com</span>
              <span className="text-[10px] text-slate-400 block">Fast 4-hour response</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-slate-900 block">Headquarters</span>
              <span className="text-slate-600">Gulshan-2, Dhaka 1212</span>
              <span className="text-[10px] text-slate-400 block">Bangladesh</span>
            </div>
          </div>

          {contactSent ? (
            <div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-2 text-teal-900 text-xs">
              <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
              <h4 className="font-bold text-sm">Thank You! Your message was sent.</h4>
              <p>Our Dhaka customer service representative will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 pt-4 border-t border-slate-100 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Your Message or Order Query</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
