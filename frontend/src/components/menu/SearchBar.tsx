import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative w-full max-w-2xl mx-auto">
    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
    <input
      type="text"
      placeholder="Search for pizza, burger, salad..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-full bg-white pl-11 pr-12 text-sm text-gray-900 placeholder:text-gray-500 border border-gray-200 shadow-sm focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all"
      aria-label="Search menu"
    />
    {value && (
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);
