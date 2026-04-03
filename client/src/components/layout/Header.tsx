import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";
import { useAuthContext } from "../../context/useAuthContext";
import { supabase } from "../../supabase";

function Header() {
  const { user, loading } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch avatar from database
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) {
        setAvatarUrl(null);
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('avatar')
        .eq('id', user.id)
        .single();

      setAvatarUrl(data?.avatar || null);
    };

    fetchAvatar();
  }, [user?.id]);

  // Fallback to auth metadata if no database avatar
  const displayAvatar = avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111318]/95 backdrop-blur-sm border-b border-[#292e38] px-4 lg:px-10 py-3">
      <div className="flex items-center justify-between gap-4 mx-auto max-w-[1440px]">
        {/* Left side - Logo and Nav */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-primary text-2xl">gavel</span></div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              RelicQuest
            </h2>
          </Link>


          {/* Navigation - Desktop only */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/auctions"
              className="text-gray-400 text-sm font-semibold hover:text-white transition-colors"
            >
              Auctions
            </Link>
            <Link
              to="/list-item"
              className="text-gray-400 text-sm font-semibold hover:text-white transition-colors"
            >
              Sell
            </Link>
            <a
              className="text-gray-400 text-sm font-semibold hover:text-white transition-colors"
              href="#"
            >
              Collection
            </a>
          </nav>
        </div>

        {/* Right side - Search, Notifications, Auth */}
        <div className="flex items-center gap-4">
          {/* Pill Search */}
          <div className="hidden md:flex bg-[#1a1f2e] border border-[#292e38] rounded-full px-4 py-1 w-56 lg:w-64 items-center gap-2">
            <span className="material-symbols-outlined text-gray-500 text-[20px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full p-0 text-white placeholder-gray-500"
              placeholder="Search collectibles..."
              type="text"
            />
          </div>
          <div className="h-9 w-px bg-[#292e38] mx-1"></div>


          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              // Loading skeleton
              <div className="flex gap-3">
                <div className="h-9 w-20 rounded-lg bg-white/5 animate-pulse"></div>
                <div className="h-9 w-24 rounded-lg bg-white/5 animate-pulse"></div>
              </div>
            ) : user ? (
              // Logged in state - show avatar only
              <Link
                to="/profile"
                className="group relative"
              >
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Profile"
                    className="size-9 rounded-full ring-2 ring-[#292e38] hover:ring-primary transition-all object-cover"
                  />
                ) : (
                  <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-[#292e38] hover:ring-primary transition-all">
                    {user.user_metadata?.given_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </Link>
            ) : (
              // Logged out state
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" glow>
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
