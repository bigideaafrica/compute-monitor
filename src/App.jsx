import { AlertTriangle, BarChart3, Clock, Search, XCircle } from 'lucide-react';
import React, { useState } from 'react';

// Import components
import ClusterStatsCard from './components/ClusterStatsCard';
import ClusterTable from './components/ClusterTable';
import Navigation from './components/Navigation';
import StatusFilter from './components/StatusFilter';

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

      {/* Main content - reduced padding */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 pt-16 pb-12">
        {/* Dashboard Header */}
        <div className="mb-3">
          <h1 className="text-lg font-bold mb-1">Compute Monitor Dashboard</h1>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Fast, Simple, Scalable, & Accelerated GPU clusters focused on Simplicity, Speed, & Affordability.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <ClusterStatsCard 
            title="Running Clusters" 
            value={runningClusters} 
            icon={<BarChart3 className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />}
            darkMode={darkMode}
          />
          <ClusterStatsCard 
            title="Deploying Clusters" 
            value={deployingClusters} 
            icon={<Clock className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />}
            darkMode={darkMode}
          />
          <ClusterStatsCard 
            title="Failed Clusters" 
            value={failedClusters} 
            icon={<XCircle className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />}
            darkMode={darkMode}
          />
          <ClusterStatsCard 
            title="Active Incidents" 
            value={totalIncidents} 
            icon={<AlertTriangle className={`w-4 h-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />}
            darkMode={darkMode}
          />
        </div>

        {/* Search and Filters */}
        <div className={`p-2 rounded mb-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className={`relative flex-1 max-w-xs ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 sm:mb-0`}>
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clusters..."
                className={`block w-full pl-7 pr-2 py-1 text-xs border rounded ${
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
        <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <ClusterTable 
            filteredClusters={filteredClusters}
            handleRename={handleRename}
            handleTerminate={handleTerminate}
            darkMode={darkMode}
          />
        </div>
      </main>

      {/* Footer - smaller */}
      <footer className={`fixed bottom-0 left-0 right-0 z-50 py-2 px-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        <div className="max-w-7xl mx-auto text-xs">
          <p>© {new Date().getFullYear()} Polaris Cloud | All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default App;