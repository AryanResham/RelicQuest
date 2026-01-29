import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import { Header } from "../components/layout";
import { Button } from "../components/ui";
import api from "../lib/axios";

export default function EditProfilePage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current user data
  const userMetadata = user?.user_metadata || {};
  const currentFirstName = userMetadata.given_name || userMetadata.name?.split(' ')[0] || '';
  const currentLastName = userMetadata.family_name || userMetadata.name?.split(' ').slice(1).join(' ') || '';
  const currentAvatar = userMetadata.avatar_url || userMetadata.picture || '';
  const displayName = currentFirstName && currentLastName 
    ? `${currentFirstName} ${currentLastName}` 
    : user?.email?.split('@')[0] || 'User';

  // Form state
  const [username, setUsername] = useState(user?.email?.split('@')[0] || '');
  const [avatarPreview, setAvatarPreview] = useState(currentAvatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=195de6&color=fff&size=160`;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = user?.id;
      if (!userId) {
        setError('User not found');
        setLoading(false);
        return;
      }

      // Upload avatar if a new file was selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const avatarResponse = await api.put(`/api/users/${userId}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!avatarResponse.data.success) {
          setError(avatarResponse.data.error || 'Failed to upload avatar');
          setLoading(false);
          return;
        }
      }

      // Update username if changed
      const currentUsername = user?.email?.split('@')[0] || '';
      if (username && username !== currentUsername) {
        const usernameResponse = await api.put(`/api/users/${userId}`, { username });
        
        if (!usernameResponse.data.success) {
          setError(usernameResponse.data.error || 'Failed to update username');
          setLoading(false);
          return;
        }
      }

      setSuccess('Profile updated successfully!');
      
      // Navigate back to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-dark)]">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-10">
        {/* Back link */}
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>

        {/* Card */}
        <div className="bg-[var(--card-dark)] rounded-xl p-6 border border-[var(--border)]">
          <h1 className="text-xl font-bold text-white mb-1">Edit Profile</h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">Update your avatar and profile information</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 border-4 border-[var(--card-dark)] shadow-xl"
                  style={{ backgroundImage: `url("${avatarPreview || defaultAvatar}")` }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-[var(--text-muted)]">
                Click the camera icon to upload a new avatar
              </p>
              {selectedFile && (
                <p className="text-sm text-primary">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full h-10 px-3 rounded-lg bg-[var(--background-dark)] border border-[var(--border)] text-sm text-white placeholder:text-[var(--text-muted)] focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full h-10 px-3 rounded-lg bg-[var(--background-dark)]/50 border border-[var(--border)] text-sm text-[var(--text-muted)] cursor-not-allowed"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" fullWidth size="lg" glow disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Link to="/profile" className="w-full">
                <Button type="button" fullWidth size="lg" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
