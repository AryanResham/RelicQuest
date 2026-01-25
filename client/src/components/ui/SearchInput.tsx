import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

function SearchInput({
  containerClassName = "",
  className = "",
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  return (
    <label className={`flex flex-col min-w-40 !h-10 ${containerClassName}`}>
      <div className="flex w-full flex-1 items-stretch rounded-lg h-full group focus-within:ring-2 ring-primary/50 transition-all">
        <div className="text-text-secondary flex border-none bg-[#292e38] items-center justify-center pl-4 rounded-l-lg border-r-0">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border-none bg-[#292e38] focus:ring-0 text-white placeholder:text-text-secondary px-3 text-sm font-normal leading-normal ${className}`}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </label>
  );
}

export default SearchInput;
