import React, { useState, useCallback, useEffect, useTransition } from 'react';
import { Search, Loader, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import Link from 'next/link';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

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
        startTransition(() => {
          setSearchResults(data.data || []);
        });
      } else {
        throw new Error('Failed to fetch search results');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching users. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(debounce((query) => handleSearchUsers(query), 300), [handleSearchUsers]);

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
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 rounded-3xl shadow-lg overflow-hidden">
      {/* Background Shadow */}
      <div className="absolute -left-10 top-0 bottom-0 w-2/3 bg-gradient-to-l from-black via-gray-900 to-transparent shadow-xl shadow-gray-800 -z-10"></div>

      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
          Discover Amazing Projects and Creators
        </h2>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-4xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-teal-400" />
          </div>
          <input
            type="text"
            placeholder="Search for users or projects"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="block w-full pl-14 pr-20 py-5 bg-gray-800 border-2 border-teal-500 rounded-full focus:ring-4 focus:ring-teal-400 focus:border-transparent text-gray-100 placeholder-gray-400 text-lg shadow-inner transition duration-300 ease-in-out"
          />
          <button
            onClick={() => handleSearchUsers(searchQuery)}
            className={`absolute inset-y-2 right-2 flex items-center px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              isLoading || isPending ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading || isPending}
          >
            {isLoading || isPending ? (
              <Loader className="h-6 w-6 animate-spin" />
            ) : (
              <span className="font-semibold">Search</span>
            )}
          </button>
        </div>

        {/* Search Results or Skeleton Loader */}
        <div className="mt-10">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-700 rounded-xl h-36"></div>
              ))}
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <div
                  key={result._id.$oid}
                  className="bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden border border-teal-500 hover:border-blue-500 transform hover:-translate-y-1"
                >
                  <div className="p-6 flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-teal-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-inner">
                        {result.username ? result.username[0].toUpperCase() : <User size={32} />}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <Link href={`/users/${result.username}`} passHref>
                        <span className="text-xl font-semibold text-teal-300 hover:text-blue-400 cursor-pointer transition duration-150 ease-in-out">
                          {result.name}
                        </span>
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">{result.email}</p>
                      <div className="mt-3 flex items-center space-x-3">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm font-medium rounded-full">
                          @{result.username || 'N/A'}
                        </span>
                        <span className="px-3 py-1 bg-teal-200 text-teal-700 text-sm font-medium rounded-full">
                          {result.projects.length} {result.projects.length === 1 ? 'Project' : 'Projects'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
