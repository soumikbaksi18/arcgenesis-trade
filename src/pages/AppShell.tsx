import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isWeexConnected, connectWeex } from '../auth/localAuth';
import { Link2, ArrowRight } from 'lucide-react';

/**
 * App Shell - Main authenticated app container
 * Shows empty state if WEEX is not connected
 */
export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const [weexConnected, setWeexConnected] = useState(false);

  useEffect(() => {
    setWeexConnected(isWeexConnected());
  }, []);

  const handleConnectWeex = () => {
    connectWeex();
    setWeexConnected(true);
    // Redirect to strategies page after connection
    navigate('/strategies');
  };

  // Show empty state if WEEX is not connected
  if (!weexConnected) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Link2 className="w-10 h-10 text-white/60" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Connect your execution engine
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            ArcGenesis executes strategies via exchange APIs. Connect WEEX to start trading with your automated strategies.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleConnectWeex}
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 group"
          >
            <span>Connect WEEX</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-white/40">
              Don't have a WEEX account?{' '}
              <a
                href="https://www.weex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If WEEX is connected, redirect to strategies
  useEffect(() => {
    if (weexConnected) {
      navigate('/strategies');
    }
  }, [weexConnected, navigate]);

  return null;
};

