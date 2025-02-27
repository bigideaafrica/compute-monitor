import { Bell, Plus } from 'lucide-react';
import React from 'react';

const Navigation = ({ darkMode, toggleDarkMode }) => {
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 w-full border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
  <div className="max-w-7xl mx-auto px-3">
    <div className="flex justify-between h-12"> {/* Reduced height from h-16 to h-12 */}
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center">
          <span className="font-bold text-base">POLARIS</span> {/* Reduced from text-xl to text-base */}
          <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-1`}>/</span> {/* Reduced spacing */}
          <span className={`font-medium text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>CLOUD</span> {/* Added text-sm */}
        </div>
      </div>

      <div className="flex items-center gap-2"> {/* Reduced gap from gap-4 */}
        <div className="flex items-center gap-1"> {/* Reduced gap */}
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Balance:</span> {/* Reduced from text-sm to text-xs */}
          <span className="text-xs font-medium">$USDC 17.23</span> {/* Reduced from text-sm to text-xs */}
        </div>

        <button className={`px-2 py-1 border rounded text-xs flex items-center gap-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
          Reload
        </button>

        <button className={`px-2 py-1 border rounded text-xs flex items-center gap-1 ${darkMode ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700' : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'}`}>
          <Plus size={12} /> {/* Reduced icon size */}
          Deploy
        </button>

        <button className={`p-1 rounded relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <Bell className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} /> {/* Reduced icon size */}
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full"></span> {/* Reduced notification dot */}
        </button>

        <button 
          onClick={toggleDarkMode}
          className={`px-2 py-0.5 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>

        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <span className="text-xs">U</span> {/* Reduced from text-sm to text-xs */}
        </div>
      </div>
    </div>
  </div>
</nav>
    );
};

export default Navigation;