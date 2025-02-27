import React from 'react';

const StatusFilter = ({ statusFilter, handleStatusChange, darkMode }) => {
    const statuses = ['Show All', 'Running', 'Failed', 'Deploying', 'Terminated'];
    
    return (
      <div className="flex gap-1 text-xs overflow-x-auto"> {/* Reduced text size and gap */}
        {statuses.map((status) => (
          <button
            key={status}
            className={`px-2 py-0.5 whitespace-nowrap rounded-full ${
              statusFilter === status 
                ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}` 
                : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'}`
            }`}
            onClick={() => handleStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    );
  };

export default StatusFilter;