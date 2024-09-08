import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { toast } from "react-toastify";
import { debounce } from 'lodash';
import Link from 'next/link';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchUsers = useCallback(async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
      } else {
        throw new Error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching users. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => handleSearchUsers(query), 300),
    [handleSearchUsers]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchUsers(searchQuery);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-4">
      <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out focus-within:shadow-md">
        <input
          type="text"
          placeholder="Search for users or projects"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-grow px-6 py-3 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 rounded-full"
        />
        <button
          onClick={() => handleSearchUsers(searchQuery)}
          className={`bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          <Search size={20} className={`transition-transform duration-300 ease-in-out ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="mt-6">
        {isLoading && (
          <p className="text-center text-gray-500 animate-pulse">Searching...</p>
        )}
        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Search Results:</h3>
            <ul className="space-y-3">
              {searchResults.map((result) => (
                <li 
                  key={result._id.$oid} 
                  className="bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                      {result.username[0]}
                    </div>
                  </div>
                  <div>
                    {result.username ? (
                      <Link 
                        href={`/users/${result.username}`}  
                        passHref
                      >
                        <span className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                          {result.name}
                        </span>
                      </Link>
                    ) : (
                      <h4 className="text-lg font-semibold text-gray-800">{result.name}</h4>
                    )}
                    <p className="text-sm text-gray-500">{result.email}</p>
                    <p className="text-sm text-gray-500">Username: {result.username || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Projects: {result.projects.length}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No results found.</p>
        )}
      </div>
    </section>
  );
};

export default SearchSection;
