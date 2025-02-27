import { MoreHorizontal, Pencil, XCircle } from 'lucide-react';
import React, { useState } from 'react';

const ActionDropdown = ({ onRename, onTerminate, clusterStatus, darkMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDropdownClick = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block">
  <button
    onClick={handleDropdownClick}
    className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}> {/* Reduced padding */}
    <MoreHorizontal className={`w-3 h-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} /> {/* Reduced icon size */}
  </button>

  {isOpen && (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={handleClickOutside}
      />
      <div className={`absolute right-0 mt-1 w-40 rounded shadow-lg border z-20 py-0.5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}> {/* Reduced width */}
        <button
          onClick={onRename}
          className={`w-full px-3 py-1 text-xs text-left flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}> {/* Reduced text, padding */}
          <Pencil className="w-3 h-3" strokeWidth={1.5} /> {/* Reduced icon size */}
          Rename
        </button>
        <button
          onClick={onTerminate}
          className={`w-full px-3 py-1 text-xs text-left flex items-center gap-1 ${clusterStatus === 'Running' || clusterStatus === 'Deploying' 
            ? `${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'}` 
            : `${darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'}`}`}
          disabled={clusterStatus !== 'Running' && clusterStatus !== 'Deploying'}
        >
          <XCircle className="w-3 h-3" strokeWidth={1.5} /> {/* Reduced icon size */}
          Terminate
        </button>
      </div>
    </>
  )}
</div>
    );
};

export default ActionDropdown;