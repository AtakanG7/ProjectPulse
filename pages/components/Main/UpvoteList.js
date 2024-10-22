import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ThumbsUp, ChevronUp, ChevronDown, RefreshCcw, Search } from 'lucide-react';
import { toast } from "react-toastify";
import Link from 'next/link';
import { debounce } from 'lodash';

const UpvoteList = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('likesCount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects?page=${reset ? 1 : pageNumber}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await res.json();
      setAllProjects((prevProjects) => reset ? data.data : [...prevProjects, ...data.data]);
      setHasMore(reset ? data.pagination.totalPages > 1 : pageNumber < data.pagination.totalPages);
      if (reset) setPageNumber(1);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, sortBy, sortOrder]);

  useEffect(() => {
    fetchProjects(true);
  }, [sortBy, sortOrder]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (pageNumber > 1) {
      fetchProjects();
    }
  }, [pageNumber, fetchProjects]);

  const handleLike = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });

      if (!res.ok) {
        throw new Error('Failed to like the project');
      }

      const updatedProject = await res.json();
      setAllProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? updatedProject.data : project
        )
      );
      toast.success("You liked the project!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchProjects(true);
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = allProjects;
    if (searchTerm) {
      filtered = allProjects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'likesCount') {
        return sortOrder === 'asc' ? a.likesCount - b.likesCount : b.likesCount - a.likesCount;
      } else if (sortBy === 'createdAt') {
        return sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }, [allProjects, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    setDisplayedProjects(filteredAndSortedProjects);
  }, [filteredAndSortedProjects]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-indigo-700">
          Discover and Support Projects
        </h2>
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="Search projects..."
                onChange={handleSearch}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="flex space-x-2">
              <select
                onChange={(e) => toggleSort(e.target.value)}
                value={sortBy}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="likesCount">Sort by Likes</option>
                <option value="createdAt">Sort by Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <button
                onClick={handleRefresh}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {displayedProjects.length === 0 && !loading && (
          <p className="text-center text-gray-600 mt-6">No projects found. Try adjusting your search or filters.</p>
        )}
        <ul className="space-y-6">
          {displayedProjects.map((project, index) => (
            <li 
              key={project._id} 
              className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow pr-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  <Link href={`https://${project?.createdBy?.username}.sprojects.live/${project?.title}`}>
                      <span className="hover:text-indigo-600 transition-colors duration-200">{project.title}</span>
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description.length > 150 ? 
                      `${project.description.slice(0, 150)}...` : 
                      project.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">
                      by {project.createdBy?.username || 'Anonymous'}
                    </span>
                    <Link href={`https://${project?.createdBy?.username}.sprojects.live/${project?.title}`}>
                      <span className="text-indigo-600 hover:text-indigo-800 font-medium">
                        View Project
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <button
                    className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200"
                    onClick={() => handleLike(project._id)}
                  >
                    <ThumbsUp className="mr-1" size={18} />
                    {project.likesCount || 0}
                  </button>
                  <span className="text-sm font-medium text-gray-500 mt-2">#{index + 1}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading more projects...</p>
          </div>
        )}
        {!hasMore && !loading && displayedProjects.length > 0 && (
          <p className="text-center text-gray-600 mt-6">No more projects to load.</p>
        )}
      </div>
    </section>
  );
};

export default UpvoteList;