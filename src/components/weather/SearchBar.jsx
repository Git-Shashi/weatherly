import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { searchCities } from '../../lib/weatherApi';

export const SearchBar = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const cities = await searchCities(query);
          setResults(cities);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const handleSelect = (city) => {
    onCitySelect(city.name);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10 pr-4 h-11"
        />
      </div>

      {/* Results dropdown */}
      {showResults && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-primary/20 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-[100]">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : (
            <ul>
              {results.map((city, index) => (
                <li
                  key={`${city.name}-${city.country}-${index}`}
                  onClick={() => handleSelect(city)}
                  className="px-4 py-2.5 hover:bg-accent cursor-pointer transition-colors border-b last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="font-medium text-sm">{city.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {city.state && `${city.state}, `}{city.country}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
