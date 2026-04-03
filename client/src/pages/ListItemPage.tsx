import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { useAuthContext } from '../context/useAuthContext';
import { useListItem } from '../hooks/useListItem';

export default function ListItemPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [bidIncrement, setBidIncrement] = useState('');
  const [endTime, setEndTime] = useState('');

  // File upload state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const mutation = useListItem();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).slice(0, 7 - files.length);
    
    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setFiles([...files, ...newFiles]);
    setPreviews([...previews, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]); // Clean up preview URL
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    mutation.mutate(
      { title, description, category, startPrice, minPrice, bidIncrement, endTime, files },
      {
        onSuccess: () => {
          previews.forEach(url => URL.revokeObjectURL(url));
          navigate('/profile');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background-dark)]">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">List an Item</h1>
          <p className="text-[var(--text-muted)]">
            Create an auction listing for your collectible
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {mutation.isError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {mutation.error?.message || 'Failed to list item. Please try again.'}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-[var(--card-dark)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Basic Information
            </h2>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., 1952 Topps Mickey Mantle #311 PSA 8"
                  className="w-full px-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item's condition, history, and any notable features..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="1">Baseball Cards</option>
                  <option value="2">Basketball Cards</option>
                  <option value="3">Football Cards</option>
                  <option value="4">Hockey Cards</option>
                  <option value="5">Soccer Cards</option>
                  <option value="6">Memorabilia</option>
                  <option value="7">Autographs</option>
                  <option value="8">Vintage</option>
                  <option value="9">Modern</option>
                  <option value="10">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-[var(--card-dark)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Images <span className="text-red-400">*</span>
              <span className="text-sm font-normal text-[var(--text-muted)] ml-auto">{files.length}/7</span>
            </h2>

            {previews.length > 0 ? (
              <div className="grid grid-cols-4 gap-3 mb-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {files.length < 7 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-[var(--border)] flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                    <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                )}
              </div>
            ) : (
              <label className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                />
                <svg className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white font-medium mb-1">Click to upload images</p>
                <p className="text-[var(--text-muted)] text-sm">Up to 7 images (max 5MB each)</p>
              </label>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-[var(--card-dark)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label htmlFor="startPrice" className="block text-sm font-medium text-white mb-2">
                  Starting Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                  <input
                    type="number"
                    id="startPrice"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-white mb-2">
                  Reserve Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                  <input
                    type="number"
                    id="minPrice"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Optional"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bidIncrement" className="block text-sm font-medium text-white mb-2">
                  Bid Increment
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                  <input
                    type="number"
                    id="bidIncrement"
                    value={bidIncrement}
                    onChange={(e) => setBidIncrement(e.target.value)}
                    placeholder="1.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Auction Duration */}
          <div className="bg-[var(--card-dark)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Auction End Time
            </h2>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-white mb-2">
                End Date & Time <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">Auction will start immediately after listing</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={mutation.isPending}
              className="flex-1 py-4 bg-[var(--card-dark)] border border-[var(--border)] hover:bg-[var(--border)] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  List Item
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
