import { Button, SearchInput } from "../ui";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#111318]/95 backdrop-blur-sm px-4 lg:px-10 py-3">
      <div className="flex items-center justify-between gap-4 mx-auto max-w-[1440px]">
        {/* Left side - Logo and Search */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"></div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              RelicQuest
            </h2>
          </div>

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

          {/* Auth Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Login
            </Button>
            <Button variant="primary" size="sm" glow>
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
