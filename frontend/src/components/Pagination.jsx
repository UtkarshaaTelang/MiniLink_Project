import React from "react";
import './Pagination.css';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return pages;
      };
    
      return (
        <div className="pagination-container">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            &lt;
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      );
};

export default Pagination;
