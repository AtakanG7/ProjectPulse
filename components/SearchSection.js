import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from "react-toastify";

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchUsers = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`/api/users/search?query=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
      } else {
        toast.error("Error searching users");
      }
    } catch (error) {
      toast.error("Error searching users");
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center border border-fb-blue rounded-full overflow-hidden shadow-lg">
        <input
          type="text"
          placeholder="Search for users or projects"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-3 focus:outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={handleSearchUsers}
          className="bg-fb-blue text-white p-3 rounded-full hover:bg-fb-dark transition-colors flex items-center"
        >
          <Search size={20} />
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Search Results:</h3>
          <ul className="space-y-2">
            {searchResults.map((result) => (
              <li key={result._id} className="bg-fb-light p-3 rounded-lg shadow-md hover:bg-fb-gray transition-colors">
                <span className="font-semibold text-fb-blue">{result.username}</span> - {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default SearchSection;
