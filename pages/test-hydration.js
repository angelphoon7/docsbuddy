// Simple test page to verify hydration is working
import { useState, useEffect } from 'react';

export default function TestHydration() {
  const [mounted, setMounted] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    setMounted(true);
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Hydration Test
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h2 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Hydration Status
              </h2>
              <p className="text-green-700 dark:text-green-300">
                {mounted ? 'Component is mounted and hydrated successfully!' : 'Component is still mounting...'}
              </p>
            </div>

            {mounted && timestamp && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🕒 Client-Side Timestamp
                </h2>
                <p className="text-blue-700 dark:text-blue-300">
                  {timestamp}
                </p>
              </div>
            )}

            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                📝 Instructions
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                If you see this page without any hydration errors in the console, the fix is working correctly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

