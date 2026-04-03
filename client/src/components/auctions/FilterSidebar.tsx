

interface FilterSidebarProps {
  isOpen: boolean;
}

export default function FilterSidebar({ isOpen }: FilterSidebarProps) {
  return (
    <aside className={`flex-shrink-0 transition-all duration-300 ${isOpen ? 'w-full lg:w-64' : 'hidden'}`}>
      <div className="sticky top-24 flex flex-col gap-5">
        
        {isOpen && (
          <>
        
        {/* Category Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[#111318] dark:text-white text-sm font-bold uppercase tracking-wider">
            Category
          </h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 group cursor-pointer">
              <input
                defaultChecked
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300 group-hover:text-primary transition-colors">
                Sports Cards
              </span>
            </label>
            <label className="flex items-center gap-2 group cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300 group-hover:text-primary transition-colors">
                Vintage Watches
              </span>
            </label>
            <label className="flex items-center gap-2 group cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300 group-hover:text-primary transition-colors">
                Comic Books
              </span>
            </label>
            <label className="flex items-center gap-2 group cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300 group-hover:text-primary transition-colors">
                Numismatics
              </span>
            </label>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[#111318] dark:text-white text-sm font-bold uppercase tracking-wider">
            Price Range
          </h3>
          <div className="flex gap-2">
            <input
              className="w-full text-xs p-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-[#111318] dark:text-white placeholder:text-[#9da6b8] focus:border-primary focus:outline-none"
              placeholder="Min"
              type="number"
            />
            <input
              className="w-full text-xs p-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-[#111318] dark:text-white placeholder:text-[#9da6b8] focus:border-primary focus:outline-none"
              placeholder="Max"
              type="number"
            />
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-radio bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                name="price"
                type="radio"
              />
              <span className="text-xs text-[#9da6b8]">Under $500</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-radio bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                name="price"
                type="radio"
              />
              <span className="text-xs text-[#9da6b8]">$500 - $5,000</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-radio bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                name="price"
                type="radio"
              />
              <span className="text-xs text-[#9da6b8]">$5,000+</span>
            </label>
          </div>
        </div>

        {/* Ending Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[#111318] dark:text-white text-sm font-bold uppercase tracking-wider">
            Ending
          </h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300">
                Within 1 Hour
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300">
                Ending Today
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300">
                Ending This Week
              </span>
            </label>
          </div>
        </div>

        {/* Condition Filter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[#111318] dark:text-white text-sm font-bold uppercase tracking-wider">
            Condition
          </h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300">
                Mint / New
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300">
                Excellent
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-checkbox rounded bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <span className="text-sm text-[#111318] dark:text-gray-300">
                Authenticated/Graded
              </span>
            </label>
          </div>
        </div>

        <button className="w-full py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3f4756] transition-colors">
          Clear All Filters
        </button>
          </>
        )}
      </div>
    </aside>
  );
}
