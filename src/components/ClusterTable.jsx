/* eslint-disable react/prop-types */
import React from 'react';
import { getStatusColor, getUsageColor } from '../utils/utils';
import ActionDropdown from './ActionDropdown';
  
const getValidationStatusColor = (status, darkMode) => {
  switch(status) {
    case 'Not Verified':
      return darkMode ? 'bg-red-800/30 text-red-300 border border-red-700/50' : 'bg-red-100 text-red-600 border border-red-200';
    case 'Verified':
      return darkMode ? 'bg-green-800/30 text-green-300 border border-green-700/50' : 'bg-green-100 text-green-600 border border-green-200';
    default:
      return darkMode ? 'bg-gray-800/30 text-gray-300 border border-gray-700/50' : 'bg-gray-100 text-gray-600 border border-gray-200';
  }
};

const HeartbeatIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12h-3.4c-.8 0-1.3-.5-1.6-1l-1.9-3.9c-.3-.6-1.1-.9-1.8-.7-.5.2-.9.8-.9 1.4v1.3c0 .4-.2.7-.5.9l-2.4 1.8c-.3.2-.5.2-.9.2H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 12h2.8c.8 0 1.3.5 1.6 1l1.9 3.9c.3.6 1.1.9 1.8.7.5-.2.9-.8.9-1.4v-1.3c0-.4.2-.7.5-.9l2.4-1.8c.3-.2.5-.2.9-.2H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);  

const getUsageBarColor = (usage) => {
  if (usage <= 30) return 'bg-green-500';
  if (usage <= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

const UsageBar = ({ cpuUsage, memoryUsage, diskUsage, darkMode }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden flex">
        <div className={`${getUsageBarColor(cpuUsage)}`} style={{ width: `${cpuUsage}%` }} title={`CPU: ${cpuUsage.toFixed(1)}%`}></div>
        <div className={`${getUsageBarColor(memoryUsage)}`} style={{ width: `${memoryUsage}%` }} title={`Memory: ${memoryUsage.toFixed(1)}%`}></div>
        <div className={`${getUsageBarColor(diskUsage)}`} style={{ width: `${diskUsage}%` }} title={`Disk: ${diskUsage.toFixed(1)}%`}></div>
      </div>
      <div className="flex justify-between text-[0.65rem]">
        <span className={`${getUsageColor(cpuUsage)} font-medium`}>CPU {cpuUsage.toFixed(1)}%</span>
        <span className={`${getUsageColor(memoryUsage)} font-medium`}>Mem {memoryUsage.toFixed(1)}%</span>
        <span className={`${getUsageColor(diskUsage)} font-medium`}>Disk {diskUsage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const NetworkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
  </svg>
);

const CommuneBadge = ({ darkMode }) => (
  <div className={`flex items-center gap-1.5 px-3 pr-5 py-1 rounded-full ${darkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
    <NetworkIcon />
    <span className="text-xs font-medium">commune</span>
  </div>
);

const BittensorBadge = ({ darkMode }) => (
  <div className={`flex items-center gap-1.5 px-3 pr-5 py-1 rounded-full ${darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
    <NetworkIcon />
    <span className="text-xs font-medium">bittensor</span>
  </div>
);

const ClusterTable = ({ filteredClusters, handleRename, handleValidate, handleDelete, handleViewMetrics, handleViewPods, darkMode, communeMiners, bittensorMiners }) => {
  return (
    <div className="h-[420px] relative">
      <div className={`absolute inset-0 overflow-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        <table className={`w-full min-w-[1200px] text-xs ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <thead className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'} sticky top-0 z-10`}>
            <tr>
              <th className="text-left p-2 w-[120px] font-semibold">Timestamp</th>
              <th className="text-left p-2 w-[90px] font-semibold">Status</th>
              <th className="text-left p-2 w-[140px] font-semibold">Validation</th>
              <th className="text-left p-2 font-semibold">Compute Name</th>
              <th className="text-left p-2 font-semibold">Location</th>
              <th className="text-left p-2 font-semibold">Network</th>
              <th className="text-left p-2 font-semibold">Compute Hrs</th>
              <th className="text-left p-2 w-[150px] font-semibold">CPUs/GPUs</th>
              <th className="text-left p-2 w-[150px] font-semibold">Usage</th>
              <th className="text-left p-2 w-[150px] font-semibold">System Details</th>
              <th className="text-left p-2 w-[80px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClusters.map((cluster, index) => (
              <tr key={index} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <td className="p-2">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{cluster.timestamp || 'N/A'}</span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(cluster.status)}`}></span>
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-800'} font-medium`}>{cluster.status}</span>
                  </div>
                </td>
                <td className="p-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getValidationStatusColor(cluster.validationStatus, darkMode)}`}>{cluster.validationStatus}</span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{cluster.name}</span>
                    {cluster.incident && (
                      <span className={`text-xs ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-500'} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                        <span>!</span> Incident
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{cluster.location}</span>
                </td>
                <td className="p-2">
                  {communeMiners && communeMiners.includes(cluster.id) ? (
                    <CommuneBadge darkMode={darkMode} />
                  ) : bittensorMiners && bittensorMiners.includes(cluster.id) ? (
                    <BittensorBadge darkMode={darkMode} />
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </td>
                <td className="p-2 font-medium">{cluster.timeRemaining}</td>
                <td className="p-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{cluster.gpu.name}</span>
                    <span className="text-[0.65rem] text-gray-500">
                      {cluster.gpu.type} {cluster.gpu.count > 1 ? `(${cluster.gpu.count} cores)` : ''}
                    </span>
                  </div>
                </td>
                <td className="p-2">
                  {cluster.status !== 'Failed' && cluster.status !== 'Terminated' ? (
                    <UsageBar cpuUsage={cluster.cpuUsage} memoryUsage={cluster.memoryUsage} diskUsage={cluster.diskUsage} darkMode={darkMode} />
                  ) : (
                    <span className="text-xs text-gray-500">No data</span>
                  )}
                </td>
                <td className="p-2">
                  <div className="flex flex-col text-[0.65rem] text-gray-500">
                    <span>{cluster.osVersion}</span>
                    <div className="flex items-center gap-0.5">
                      <span>HB:</span>
                      <span className="text-sm">{cluster.status === 'Running' ? '❤️' : '🩶'}</span>
                      <span>{cluster.heartbeatCount}</span>
                    </div>
                    <div className="mt-0.5">
                      <span>Last: {cluster.lastHeartbeat}</span>
                    </div>
                  </div>
                </td>
                <td className="p-2 text-left">
                  <ActionDropdown
                    onRename={() => handleRename(index)}
                    onValidate={() => handleValidate(index)}
                    onDelete={() => handleDelete(index)}
                    onViewMetrics={handleViewMetrics ? () => handleViewMetrics(index) : null}
                    onViewPods={handleViewPods ? () => handleViewPods(index) : null}
                    clusterStatus={cluster.status}
                    validationStatus={cluster.validationStatus}
                    darkMode={darkMode}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClusterTable;