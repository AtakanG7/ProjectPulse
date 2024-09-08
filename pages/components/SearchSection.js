import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader, User } from 'lucide-react';
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
    <section className="relative from-gray-900 via-black to-gray-800 text-white py-20 rounded-3xl shadow-lg">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-30 -z-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Discover Amazing Projects and Creators
        </h2>

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-purple-400" />
          </div>
          <input
            type="text"
            placeholder="Search for users or projects"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="block w-full pl-14 pr-20 py-5 bg-gray-800 border-2 border-purple-500 rounded-full focus:ring-4 focus:ring-purple-400 focus:border-transparent text-gray-100 placeholder-gray-400 text-lg shadow-inner transition duration-300 ease-in-out"
          />
          <button
            onClick={() => handleSearchUsers(searchQuery)}
            className="absolute inset-y-2 right-2 flex items-center px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-6 w-6 animate-spin" />
            ) : (
              <span className="font-semibold">Search</span>
            )}
          </button>
        </div>

        {/* Search Results */}
        <div className="mt-10">
          {isLoading && (
            <div className="flex justify-center items-center space-x-3">
              <Loader className="h-8 w-8 text-purple-500 animate-spin" />
              <p className="text-gray-300 font-medium text-xl">Searching the universe...</p>
            </div>
          )}
          {!isLoading && searchResults.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-purple-300">Discover These Creators:</h3>
              <ul className="space-y-6">
                {searchResults.map((result) => (
                  <li
                    key={result._id.$oid}
                    className="bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden border border-purple-500 hover:border-pink-500 transform hover:-translate-y-1"
                  >
                    <div className="p-6 flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-inner">
                          {result.username ? result.username[0].toUpperCase() : <User size={32} />}
                        </div>
                      </div>
                      <div className="flex-grow">
                        {result.username ? (
                          <Link href={`/users/${result.username}`} passHref>
                            <span className="text-xl font-semibold text-purple-300 hover:text-pink-400 cursor-pointer transition duration-150 ease-in-out">
                              {result.name}
                            </span>
                          </Link>
                        ) : (
                          <h4 className="text-xl font-semibold text-gray-300">{result.name}</h4>
                        )}
                        <p className="text-sm text-gray-400 mt-1">{result.email}</p>
                        <div className="mt-3 flex items-center space-x-3">
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm font-medium rounded-full">
                            @{result.username || 'N/A'}
                          </span>
                          <span className="px-3 py-1 bg-purple-200 text-purple-700 text-sm font-medium rounded-full">
                            {result.projects.length} {result.projects.length === 1 ? 'Project' : 'Projects'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!isLoading && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-12 bg-gray-800 rounded-2xl border-2 border-dashed border-gray-600">
              <Search className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <p className="text-gray-300 font-semibold text-xl mb-2">No results found.</p>
              <p className="text-gray-400 text-lg">Try adjusting your search terms or explore different keywords.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
