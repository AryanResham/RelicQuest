import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { useAuthContext } from '../context/useAuthContext';
import { supabase } from '../supabase';

export default function BecomeSellerPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [storeName, setStoreName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('You must be logged in to become a seller');
      return;
    }

    if (!storeName.trim()) {
      setError('Store name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create seller profile
      const { error: sellerError } = await supabase
        .from('seller')
        .upsert({
          id: user.id,
          store_name: storeName.trim(),
          phone_no: phoneNo.trim() || null,
        });

      if (sellerError) {
        console.log("error creating seller", sellerError)
        throw sellerError;
      }

      // Update user's is_seller flag
      const { error: userError } = await supabase
        .from('users')
        .update({ is_seller: true })
        .eq('id', user.id);

      if (userError) {
        console.log("error updating user", userError)
        throw userError;
      }

      // Success! Navigate to profile
      navigate('/profile');
    } catch (err) {
      console.error('Error becoming seller:', err);
      setError(err instanceof Error ? err.message : 'Failed to become a seller. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-dark)]">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Become a Seller</h1>
          <p className="text-lg text-[var(--text-muted)] max-w-md mx-auto">
            Start selling your collectibles and reach thousands of passionate collectors worldwide.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: '🎯', title: 'Reach Collectors', desc: 'Access our growing community' },
            { icon: '💰', title: 'Competitive Fees', desc: 'Low seller fees on all sales' },
            { icon: '🛡️', title: 'Secure Payments', desc: 'Protected transactions' },
          ].map((benefit) => (
            <div key={benefit.title} className="bg-[var(--card-dark)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <h3 className="font-bold text-white text-sm">{benefit.title}</h3>
              <p className="text-xs text-[var(--text-muted)]">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-[var(--card-dark)] border border-[var(--border)] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Seller Information</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-white mb-2">
                Store Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g., Vintage Vault Collectibles"
                className="w-full px-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                This is how buyers will see your store
              </p>
            </div>

            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium text-white mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="phoneNo"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                For account verification and support
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Setting up your store...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Selling
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
              By becoming a seller, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Seller Terms</a>
              {' '}and{' '}
              <a href="/fees" className="text-primary hover:underline">Fee Structure</a>
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
