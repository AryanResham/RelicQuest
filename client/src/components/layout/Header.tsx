import { Link } from "react-router-dom";
import { Button, SearchInput } from "../ui";
import { useAuthContext } from "../../context/useAuthContext";

function Header() {
  const { user, loading } = useAuthContext();


  return (
    <header className="sticky top-0 z-50 w-full bg-[#111318]/95 backdrop-blur-sm px-4 lg:px-10 py-3">
      <div className="flex items-center justify-between gap-4 mx-auto max-w-[1440px]">
        {/* Left side - Logo and Search */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-primary text-2xl">
    gavel
  </span>
</div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              RelicQuest
            </h2>
          </Link>

          {/* Search - Desktop only */}
          <div className="hidden md:flex">
            <SearchInput
              containerClassName="w-64 lg:w-96"
              placeholder="Search for collectibles..."
            />
          </div>
        </div>

        {/* Right side - Nav and Buttons */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Navigation - Desktop only */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              className="text-white text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              How it Works
            </a>
            <a
              className="text-white text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              Auctions
            </a>
            <a
              className="text-white text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              Sell
            </a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              // Loading skeleton
              <div className="flex gap-3">
                <div className="h-9 w-20 rounded-lg bg-white/5 animate-pulse"></div>
                <div className="h-9 w-24 rounded-lg bg-white/5 animate-pulse"></div>
              </div>
            ) : user ? (
              // Logged in state - show avatar only, no logout button
              <Link
                to="/profile"
                className="group relative"
              >
                {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <img
                    src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                    alt="Profile"
                    className="size-10 rounded-full ring-2 ring-primary/50 hover:ring-primary transition-all object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/50 hover:ring-primary transition-all">
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
