import React, { useState, useCallback, useEffect, useTransition, useDeferredValue } from 'react';
import { Search, Loader, User } from 'lucide-react';
import { Coffee } from 'lucide-react';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import Link from 'next/link';
import OneTimeToastSequence from './CustomToast';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deferredSearchQuery = useDeferredValue(searchQuery);

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
  }, [startTransition]);

  const debouncedSearch = useCallback(debounce((query) => handleSearchUsers(query), 300), [handleSearchUsers]);

  useEffect(() => {
    debouncedSearch(deferredSearchQuery);
    return () => debouncedSearch.cancel();
  }, [deferredSearchQuery, debouncedSearch]);

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
    <section className="bg-gradient-to-br py-20 px-4 sm:px-6 lg:px-8">
      <OneTimeToastSequence />
      <div className="container mx-auto max-w-4xl">
        {/* Search Bar */}
        <div className="relative mb-10 transition-all duration-300 ease-in-out transform hover:scale-105">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-700" />
          </div>
          <input
            type="text"
            placeholder="Search for amazing projects or creators"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="block w-full pl-10 pr-3 py-4 border-2 border-indigo-300 rounded-full leading-5 bg-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent text-indigo-800 text-lg transition-all duration-300 ease-in-out"
          />
          <button
            onClick={() => handleSearchUsers(searchQuery)}
            className={`absolute inset-y-2 right-2 flex items-center px-6 py-2 text-white bg-indigo-700 hover:bg-indigo-800 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading || isPending ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading || isPending}
          >
            {isLoading || isPending ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <span className="text-sm font-medium">Search</span>
            )}
          </button>
        </div>

        {/* Search Results or Skeleton Loader */}
        <div className="mt-8 transition-all duration-500 ease-in-out">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-2xl h-32 shadow-md"></div>
              ))}
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <div
                  key={result._id.$oid}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transform hover:-translate-y-1"
                >
                  <div className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
                        {result.username ? result.username[0].toUpperCase() : <User size={28} />}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <Link href={`/users/${result.username}`} passHref>
                        <span className="text-xl font-semibold text-indigo-700 hover:text-indigo-500 cursor-pointer transition duration-150 ease-in-out">
                          {result.name}
                        </span>
                      </Link>
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                          @{result.username || 'N/A'}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
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
            <div className="text-center py-12 bg-white rounded-2xl shadow-md border-2 border-dashed border-indigo-300 transition-all duration-300 ease-in-out transform hover:scale-105">
              <Search className="mx-auto h-16 w-16 text-indigo-400 mb-4" />
              <p className="text-indigo-800 font-semibold text-xl mb-2">No results found</p>
              <p className="text-indigo-600 text-lg">Try adjusting your search or explore new exciting projects!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
