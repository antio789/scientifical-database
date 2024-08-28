"use client";

import { useState, useEffect } from "react";



// Define the type for the article data
interface Article {
  doi: string;
  title: string;
  abstract: string;
  review: string;
  authors: string[];
  publicationDate: string;
  field: string;
  interest: string[];
}



// The Results component
const Results = () => {
  // Fetch articles data from the server-side function
  const [articles, setArticles] = useState<Article[]>([]);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fieldFilter, setFieldFilter] = useState<string | null>(null);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.dir(data,{ depth: null})
          console.error("Fetched data is an array:", data.items)
          
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
  
    fetchArticles();
  }, []);
  

  const handleFilterChange = (value: string | null) => {
    setFilter(value);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleFieldFilterChange = (value: string | null) => {
    setFieldFilter(value);
    setIsFieldDropdownOpen(false); // Close the dropdown after selection
  };

  const filteredArticles = articles.filter((article) => {
    const matchesReviewFilter = filter === null || article.review === filter;
    const matchesFieldFilter = fieldFilter === null || article.field === fieldFilter;
    return matchesReviewFilter && matchesFieldFilter;
  });

  const toggleArticleDetails = (doi: string) => {
    setExpandedArticle((prev) => (prev === doi ? null : doi));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Articles on Biogas Technology</h1>
      
      {/* Filter Bar */}
      <div className="flex space-x-4 mb-6">
        {/* Review Dropdown Filter Bar */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
          >
            Review: {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "All"}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleFilterChange(null)}
              >
                All
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleFilterChange('yes')}
              >
                Reviews
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleFilterChange('no')}
              >
                Research Articles
              </button>
            </div>
          )}
        </div>

        {/* Field Dropdown Filter Bar */}
        <div className="relative">
          <button
            onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
          >
            Field: {fieldFilter ? fieldFilter.charAt(0).toUpperCase() + fieldFilter.slice(1) : "All"}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isFieldDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleFieldFilterChange(null)}
              >
                All
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleFieldFilterChange('general')}
              >
                General
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredArticles.map((article) => (
         <div key={article.doi} className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-2xl w-full">
         <h2
           className="text-2xl font-semibold mb-4 cursor-pointer text-blue-600"
           onClick={() => toggleArticleDetails(article.doi)}
         >
           {article.title}
         </h2>

         {expandedArticle === article.doi && (
           <>
             <p className="text-gray-600 mb-2"><strong>DOI:</strong> {article.doi}</p>
             <p className="text-gray-600 mb-2"><strong>Publication Date:</strong> {new Date(article.publicationDate).toDateString()}</p>
             <p className="text-gray-600 mb-4"><strong>Authors:</strong> {article.authors.join(", ")}</p>
             <h3 className="text-xl font-semibold mb-2">Review</h3>
             <p className="text-gray-800">{article.review}</p>
             <h3 className="text-xl font-semibold mb-2">field</h3>
             <p className="text-gray-800">{article.field}</p>
             <h3 className="text-xl font-semibold mb-2">interest</h3>
             <p className="text-gray-800">{article.interest.join(", ")}</p>
             <h3 className="text-xl font-semibold mb-2">Abstract</h3>
             <p className="text-gray-800 text-customsmall">{article.abstract}</p>
             
             <button
               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
               onClick={() => toggleArticleDetails(article.doi)}
             >
               Close
             </button>
           </>
         )}
       </div>
      ))}
    </div>
  );
};

export default Results;
