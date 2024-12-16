'use client';

import { useEffect, useState } from 'react';

export function PWAInstallToast() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-black/90 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm">Add GenZ Dict to your home screen for quick access! 📱</p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="text-xs px-3 py-1 rounded hover:bg-white/10 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="text-xs px-3 py-1 bg-white text-black rounded hover:bg-white/90 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
