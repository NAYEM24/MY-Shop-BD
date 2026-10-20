import React, { useState } from 'react';
import {
  FolderDown,
  Download,
  CloudUpload,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { backupDigitalProductToDrive } from '../../services/driveService.ts';

export const DigitalLibraryPage: React.FC = () => {
  const {
    digitalEntitlements,
    markEntitlementDownloaded,
    markEntitlementDriveExported,
    googleAccessToken,
    loginWithGoogle,
    setCurrentView,
    showToast,
  } = useShop();

  const [activeDriveModalEntitlement, setActiveDriveModalEntitlement] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = (entitlement: any) => {
    if (entitlement.isRevoked) {
      showToast('Access to this digital file has been revoked due to order cancellation or refund.', 'error');
      return;
    }

    if (entitlement.downloadLimit > 0 && entitlement.downloadCount >= entitlement.downloadLimit) {
      showToast(`Download limit of ${entitlement.downloadLimit} downloads has been reached.`, 'error');
      return;
    }

    // Trigger simulated secure browser download
    markEntitlementDownloaded(entitlement.id);

    const fileContent = `# MY SHOP BD OFFICIAL DIGITAL RELEASE
File: ${entitlement.fileName}
Product: ${entitlement.productName}
License: Single-user educational & personal license.
Issued to Customer ID: ${entitlement.userId}
Timestamp: ${new Date().toISOString()}

Thank you for your purchase from MY SHOP BD!
Official Bangladesh Customer Support: support@myshopbd.com`;

    const blob = new Blob([fileContent], { type: entitlement.mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = entitlement.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Download started for "${entitlement.fileName}"!`, 'success');
  };

  const handleConfirmDriveBackup = async () => {
    if (!activeDriveModalEntitlement) return;
    const entitlement = activeDriveModalEntitlement;
    setActiveDriveModalEntitlement(null);

    if (!googleAccessToken) {
      try {
        await loginWithGoogle();
      } catch {
        return;
      }
    }

    const token = googleAccessToken;
    if (!token) {
      showToast('Please sign in with Google to enable Drive backup.', 'error');
      return;
    }

    setIsExporting(true);
    try {
      const sampleText = `MY SHOP BD VERIFIED DIGITAL ASSET
File: ${entitlement.fileName}
Product: ${entitlement.productName}
Unlocked at: ${entitlement.unlockedAt}`;

      const res = await backupDigitalProductToDrive(
        entitlement.productName,
        entitlement.fileName,
        sampleText,
        token
      );

      markEntitlementDriveExported(entitlement.id, res.id);
      showToast(`"${entitlement.fileName}" saved to your Google Drive!`, 'success');
    } catch (err: any) {
      showToast(`Drive Backup Error: ${err?.message || 'Failed to upload'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold">
              <FolderDown className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Digital Library</h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Access your purchased e-books, Cambridge notes, genomics handbooks, and code kits with authenticated tokens and direct Google Drive cloud sync.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl text-xs text-slate-300">
            <span className="text-[11px] text-slate-400 block">Total Digital Assets:</span>
            <span className="text-lg font-bold text-white font-mono">
              {digitalEntitlements.length} files
            </span>
          </div>
        </div>
      </div>

      {/* Entitlements List */}
      {digitalEntitlements.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Digital Library is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't purchased any digital guides or e-books yet. Check out our high-demand science publications and programming bundles!
          </p>
          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Browse Digital Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {digitalEntitlements.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all bg-white shadow-xs flex flex-col justify-between ${
                item.isRevoked ? 'border-rose-200 opacity-70' : 'border-slate-200/90 hover:border-teal-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Protected Cloud PDF</span>
                  </span>

                  {item.isRevoked ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      Revoked (Refunded)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">
                      Downloads: {item.downloadCount} / {item.downloadLimit}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{item.productName}</h3>
                <p className="font-mono text-xs text-slate-500 truncate">{item.fileName}</p>

                <div className="text-[11px] text-slate-400">
                  <span>Unlocked on: {new Date(item.unlockedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  disabled={item.isRevoked || item.downloadCount >= item.downloadLimit}
                  className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDriveModalEntitlement(item)}
                  disabled={item.isRevoked}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  title="Backup to Google Drive"
                >
                  <CloudUpload className="w-4 h-4 text-sky-400" />
                  <span>{item.driveExported ? 'Re-sync Drive' : 'Save to Drive'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory User Confirmation Modal for Google Workspace Operation */}
      {activeDriveModalEntitlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CloudUpload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Backup Digital Product to Google Drive?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Save <strong>{activeDriveModalEntitlement.fileName}</strong> directly to your personal Google Drive account in the <strong>"MY SHOP BD Downloads"</strong> folder.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>File is stored securely under your own Google account.</span>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveDriveModalEntitlement(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDriveBackup}
                disabled={isExporting}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-300 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                {isExporting ? 'Saving to Drive...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
