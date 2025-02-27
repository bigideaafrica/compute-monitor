import React from 'react';
import { getStatusColor, getUsageBgColor, getUsageColor } from '../utils/utils';
import ActionDropdown from './ActionDropdown';

const ClusterTable = ({ filteredClusters, handleRename, handleTerminate, darkMode }) => {
    return (
        // This outer div prevents the table scroll from affecting the page
        <div className="h-[420px] relative">
            {/* This is the scrollable container for the table with custom scrollbar */}
            <div className={`absolute inset-0 overflow-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                <table className={`w-full min-w-[500px] text-xs ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <thead className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'} sticky top-0 z-10`}>
                        <tr>
                            <th className="text-left p-2 w-[90px]">Status</th>
                            <th className="text-left p-2">Cluster Name</th>
                            <th className="text-left p-2 w-[120px]">Compute Hrs</th>
                            <th className="text-left p-2 w-[160px]">CPUs/GPUs</th>
                            <th className="text-left p-2 w-[180px]">Usage</th>
                            <th className="text-right p-2 w-[40px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClusters.map((cluster, index) => (
                            <tr key={index} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                                <td className="p-2">
                                    <div className="flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(cluster.status)}`}></span>
                                        <span className={`${darkMode ? 'text-gray-300' : ''}`}>{cluster.status}</span>
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div className="flex items-center gap-1">
                                        <span>{cluster.name}</span>
                                        {cluster.incident && (
                                            <span className={`text-xs ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-500'} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                                                <span>!</span>
                                                Incident
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-2">{cluster.timeRemaining}</td>
                                <td className="p-2">
                                    <div className="flex items-center gap-1">
                                        <span>{cluster.gpu.type}</span>
                                        <span className="text-xs text-gray-500">{cluster.gpu.count}</span>
                                        {cluster.clusterType && (
                                            <span className={`text-xs px-1 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'}`}>
                                                {cluster.clusterType}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-2">
                                    {cluster.status !== 'Failed' && cluster.status !== 'Terminated' ? (
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs">CPU</span>
                                                <span className={`text-xs ${getUsageColor(cluster.cpuUsage)}`}>{cluster.cpuUsage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                                                <div 
                                                    className={`h-1 rounded-full ${getUsageBgColor(cluster.cpuUsage)}`} 
                                                    style={{ width: `${cluster.cpuUsage}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <span className="text-xs">Mem</span>
                                                <span className={`text-xs ${getUsageColor(cluster.memoryUsage)}`}>{cluster.memoryUsage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                                                <div 
                                                    className={`h-1 rounded-full ${getUsageBgColor(cluster.memoryUsage)}`} 
                                                    style={{ width: `${cluster.memoryUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500">No data</span>
                                    )}
                                </td>
                                <td className="p-2 text-right">
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
        </div>
    );
};

export default ClusterTable;