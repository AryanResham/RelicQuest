function Footer() {
  return (
    <footer className="bg-[#0b0e14] border-t border-[#1e232d] py-12 px-4 lg:px-10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white mb-2">
            <div className="size-6 rounded-md bg-primary/20 flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                gavel
              </span>
            </div>
            <h2 className="text-lg font-bold">RelicQuest</h2>
          </div>
          <p className="text-text-secondary text-sm">
            The world's premier destination for collectible auctions. Buy and
            sell with confidence.
          </p>
        </div>

        {/* Marketplace links */}
        <div>
          <h4 className="text-white font-bold mb-4">Marketplace</h4>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                All Auctions
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Trending
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Categories
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Past Sales
              </a>
            </li>
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Help Center
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Authentication
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Selling Guide
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Legal links */}
        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Terms of Service
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-[#1e232d] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-secondary text-xs">
          © 2024 RelicQuest Inc. All rights reserved.
        </p>
        <div className="flex gap-4 text-text-secondary">
          <a className="hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined">public</span>
          </a>
          <a className="hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined">chat</span>
          </a>
          <a className="hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined">rss_feed</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
