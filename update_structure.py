import os


def create_directory(path):
    """Create directory if it doesn't exist"""
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")

def create_file(path, content=""):
    """Create file with content"""
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Created file: {path}")

def update_structure():
    # Create directories
    create_directory("src/components")
    create_directory("src/data")
    create_directory("src/utils")
    
    # Update tailwind.config.js
    create_file("tailwind.config.js", """/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}""")
    
    # Update index.css
    create_file("src/index.css", """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}""")
    
    # Create data.js
    create_file("src/data/data.js", """// src/data/data.js

export const initialClusters = [
  {
    status: 'Running',
    name: 'Mega cluster testing redis',
    timeRemaining: '68 Hrs 44 Mins',
    gpu: { type: 'Ryzen 7000', count: 'x32' },
    clusterType: 'Mega Cluster',
    cpuUsage: 78,
    memoryUsage: 65
  },
  {
    status: 'Failed',
    name: 'Testing new QTY',
    timeRemaining: '68 Hrs 44 Mins',
    gpu: { type: 'RTX 3090', count: 'x7' },
    incident: true,
    cpuUsage: 0,
    memoryUsage: 0
  },
  {
    status: 'Running',
    name: 'TESTNET HK',
    timeRemaining: '56 Hrs 22 Mins',
    gpu: { type: 'RTX 4090', count: 'x2' },
    cpuUsage: 45,
    memoryUsage: 32
  },
  {
    status: 'Failed',
    name: 'taiwo mega cluster connectivity 1',
    timeRemaining: '49 Hrs 23 Mins',
    gpu: { type: 'M2 ULTRA', count: 'x55' },
    clusterType: 'Mega Cluster',
    incident: true,
    cpuUsage: 0,
    memoryUsage: 0
  },
  {
    status: 'Deploying',
    name: 'taiwo mega cluster connectivity 2',
    timeRemaining: '12 Hrs 13 Sec',
    gpu: { type: 'M2 ULTRA', count: 'x69' },
    clusterType: 'Mega Cluster',
    cpuUsage: 22,
    memoryUsage: 18
  },
  {
    status: 'Running',
    name: 'taiwo mega cluster connectivity 3',
    timeRemaining: '12 Hrs 21 Mins',
    gpu: { type: 'Ryzen 7000', count: 'x1' },
    cpuUsage: 91,
    memoryUsage: 87
  },
  {
    status: 'Deploying',
    name: 'Latitude.sh test',
    timeRemaining: '12 Hrs 13 Sec',
    gpu: { type: 'M2 ULTRA', count: 'x1' },
    cpuUsage: 12,
    memoryUsage: 9
  }
];

// You can add more data exports here, like:
export const gpuTypes = ['RTX 3090', 'RTX 4090', 'M2 ULTRA', 'Ryzen 7000'];

export const clusterTypes = ['Standard Cluster', 'Mega Cluster'];

// For usage in charts or statistics
export const usageThresholds = {
  low: 60,
  high: 80
};""")
    
    # Create utils.js
    create_file("src/utils/utils.js", """// src/utils/utils.js

/**
 * Get the appropriate color for a usage percentage
 * @param {number} percentage - The usage percentage
 * @returns {string} - The Tailwind CSS color class
 */
export const getUsageColor = (percentage) => {
  if (percentage >= 80) return 'text-red-500';
  if (percentage >= 60) return 'text-yellow-500';
  return 'text-green-500';
};

/**
 * Get the appropriate background color for a usage percentage
 * @param {number} percentage - The usage percentage
 * @returns {string} - The Tailwind CSS color class
 */
export const getUsageBgColor = (percentage) => {
  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * Get the appropriate color for a cluster status
 * @param {string} status - The cluster status
 * @returns {string} - The Tailwind CSS color class
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Running':
      return 'bg-green-500';
    case 'Failed':
      return 'bg-red-500';
    case 'Deploying':
      return 'bg-blue-500';
    case 'Terminated':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

/**
 * Format a number with commas
 * @param {number} num - The number to format
 * @returns {string} - The formatted number
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
};

/**
 * Format a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} - The formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};""")
    
    # Create component files
    create_file("src/components/ActionDropdown.jsx", """import React, { useState } from 'react';
import { MoreHorizontal, Pencil, XCircle } from 'lucide-react';

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
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
                <MoreHorizontal className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={handleClickOutside}
                    />
                    <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg border z-20 py-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <button
                            onClick={onRename}
                            className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Pencil className="w-4 h-4" strokeWidth={1.5} />
                            Rename
                        </button>
                        <button
                            onClick={onTerminate}
                            className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 ${clusterStatus === 'Running' || clusterStatus === 'Deploying' 
                                ? `${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'}` 
                                : `${darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'}`}`}
                            disabled={clusterStatus !== 'Running' && clusterStatus !== 'Deploying'}
                        >
                            <XCircle className="w-4 h-4" strokeWidth={1.5} />
                            Terminate
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ActionDropdown;""")
    
    create_file("src/components/ClusterStatsCard.jsx", """import React from 'react';

const ClusterStatsCard = ({ title, value, icon, darkMode }) => {
    return (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
                {icon}
            </div>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
};

export default ClusterStatsCard;""")
    
    create_file("src/components/ClusterTable.jsx", """import React from 'react';
import ActionDropdown from './ActionDropdown';
import { getUsageColor, getUsageBgColor, getStatusColor } from '../utils/utils';

const ClusterTable = ({ filteredClusters, handleRename, handleTerminate, darkMode }) => {
    return (
        <div className="mt-6 overflow-x-auto">
            <table className={`w-full min-w-[500px] border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <thead className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'} text-sm`}>
                    <tr>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Cluster Name</th>
                        <th className="text-left p-4">Compute Hrs Remaining</th>
                        <th className="text-left p-4">CPUs/GPUs</th>
                        <th className="text-left p-4">Usage</th>
                        <th className="text-left p-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClusters.map((cluster, index) => (
                        <tr key={index} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getStatusColor(cluster.status)}`}></span>
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{cluster.status}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{cluster.name}</span>
                                    {cluster.incident && (
                                        <span className={`text-xs ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-500'} px-2 py-1 rounded flex items-center gap-1`}>
                                            <span>!</span>
                                            Ongoing Incident
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">{cluster.timeRemaining}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{cluster.gpu.type}</span>
                                    <span className="text-xs text-gray-500">{cluster.gpu.count}</span>
                                    {cluster.clusterType && (
                                        <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'}`}>
                                            {cluster.clusterType}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                {cluster.status !== 'Failed' && cluster.status !== 'Terminated' ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs">CPU</span>
                                            <span className={`text-xs ${getUsageColor(cluster.cpuUsage)}`}>{cluster.cpuUsage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                            <div 
                                                className={`h-1.5 rounded-full ${getUsageBgColor(cluster.cpuUsage)}`} 
                                                style={{ width: `${cluster.cpuUsage}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs">Memory</span>
                                            <span className={`text-xs ${getUsageColor(cluster.memoryUsage)}`}>{cluster.memoryUsage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                            <div 
                                                className={`h-1.5 rounded-full ${getUsageBgColor(cluster.memoryUsage)}`} 
                                                style={{ width: `${cluster.memoryUsage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-500">No data available</span>
                                )}
                            </td>
                            <td className="p-4">
                                <ActionDropdown
                                    onRename={() => handleRename(index)}
                                    onTerminate={() => handleTerminate(index)}
                                    clusterStatus={cluster.status}
                                    darkMode={darkMode}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClusterTable;""")
    
    create_file("src/components/Navigation.jsx", """import React from 'react';
import { Bell, Plus } from 'lucide-react';

const Navigation = ({ darkMode, toggleDarkMode }) => {
    return (
        <nav className={`w-full border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl">POLARIS</span>
                            <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-2`}>/</span>
                            <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>CLOUD</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Balance:</span>
                            <span className="text-sm font-medium">$USDC 17.23</span>
                        </div>

                        <button className={`px-4 py-1.5 border rounded-lg text-sm flex items-center gap-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
                            Reload with Pay
                        </button>

                        <button className={`px-4 py-1.5 border rounded-lg text-sm flex items-center gap-2 ${darkMode ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700' : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'}`}>
                            <Plus size={16} />
                            Deploy Cluster
                        </button>

                        <button className={`p-1.5 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>

                        <button 
                            onClick={toggleDarkMode}
                            className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {darkMode ? 'Light' : 'Dark'}
                        </button>

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <span className="text-sm">U</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;""")
    
    create_file("src/components/StatusFilter.jsx", """import React from 'react';

const StatusFilter = ({ statusFilter, handleStatusChange, darkMode }) => {
    const statuses = ['Show All', 'Running', 'Failed', 'Deploying', 'Terminated'];
    
    return (
        <div className="flex gap-2 text-sm overflow-x-auto">
            {statuses.map((status) => (
                <button
                    key={status}
                    className={`px-3 py-1 whitespace-nowrap rounded-full ${
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

export default StatusFilter;""")
    
    # Update App.js to App.jsx
    create_file("src/App.jsx", """import React, { useState } from 'react';
import { BarChart3, Clock, XCircle, AlertTriangle, Search } from 'lucide-react';

// Import components
import Navigation from './components/Navigation';
import ClusterStatsCard from './components/ClusterStatsCard';
import StatusFilter from './components/StatusFilter';
import ClusterTable from './components/ClusterTable';

// Import data from separate file
import { initialClusters } from './data/data';

function App() {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const [clusters, setClusters] = useState(initialClusters);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Show All');

  // Stats calculations
  const runningClusters = clusters.filter(c => c.status === 'Running').length;
  const deployingClusters = clusters.filter(c => c.status === 'Deploying').length;
  const failedClusters = clusters.filter(c => c.status === 'Failed').length;
  const totalIncidents = clusters.filter(c => c.incident).length;

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleTerminate = (index) => {
    setClusters((prevClusters) =>
      prevClusters.map((cluster, i) =>
        i === index && (cluster.status === 'Running' || cluster.status === 'Deploying')
          ? { ...cluster, status: 'Terminated', cpuUsage: 0, memoryUsage: 0 }
          : cluster
      )
    );
  };

  const handleRename = (index) => {
    const newName = prompt("Enter new name for the cluster:");
    if (newName) {
      setClusters((prevClusters) =>
        prevClusters.map((cluster, i) =>
          i === index ? { ...cluster, name: newName } : cluster
        )
      );
    }
  };

  // Filtered clusters
  const filteredClusters = clusters.filter(cluster => {
    const matchesSearch = cluster.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Show All' || cluster.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation */}
      <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Compute Monitor Dashboard</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Fast, Simple, Scalable, & Accelerated GPU clusters focused on Simplicity, Speed, & Affordability.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ClusterStatsCard 
            title="Running Clusters" 
            value={runningClusters} 
            icon={<BarChart3 className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />}
            darkMode={darkMode}
          />
          <ClusterStatsCard 
            title="Deploying Clusters" 
            value={deployingClusters} 
            icon={<Clock className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />}
            darkMode={darkMode}
          />
          <ClusterStatsCard 
            title="Failed Clusters" 
            value={failedClusters} 
            icon={<XCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
            darkMode={darkMode}
          />
          <ClusterStatsCard 
            title="Active Incidents" 
            value={totalIncidents} 
            icon={<AlertTriangle className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />}
            darkMode={darkMode}
          />
        </div>

        {/* Search and Filters */}
        <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            <div className={`relative flex-1 max-w-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clusters..."
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <StatusFilter 
              statusFilter={statusFilter} 
              handleStatusChange={handleStatusChange} 
              darkMode={darkMode} 
            />
          </div>
        </div>

        {/* Clusters Table */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <ClusterTable 
            filteredClusters={filteredClusters}
            handleRename={handleRename}
            handleTerminate={handleTerminate}
            darkMode={darkMode}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-4 px-8 border-t ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        <div className="max-w-7xl mx-auto text-sm">
          <p>© {new Date().getFullYear()} Polaris Cloud | All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default App;""")
    
    print("\nProject structure updated successfully!")
    print("\nYou can now run the application with:")
    print("npm run dev")

if __name__ == "__main__":
    update_structure()    