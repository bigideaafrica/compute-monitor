import { X } from 'lucide-react';
import React from 'react';
import { getUsageBgColor } from '../utils/utils';

const MetricsModal = ({ cluster, onClose, darkMode }) => {
    if (!cluster) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-500'} opacity-75`}></div>
                </div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg leading-6 font-medium">{cluster.name} Metrics</h3>
                            <button onClick={onClose} className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="mt-4">
                            <div className={`p-4 mb-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <h4 className="font-medium mb-2">Cluster Information</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <p>{cluster.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p>{cluster.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Compute Type</p>
                                        <p>{cluster.clusterType || 'CPU'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Uptime</p>
                                        <p>{cluster.timeRemaining}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`p-4 mb-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <h4 className="font-medium mb-2">Resource Usage</h4>
                                {cluster.status !== 'Failed' && cluster.status !== 'Terminated' ? (
                                    <>
                                        <div className="mb-3">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm">CPU Usage</span>
                                                <span className="text-sm">{cluster.cpuUsage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                                <div 
                                                    className={`h-2 rounded-full ${getUsageBgColor(cluster.cpuUsage)}`} 
                                                    style={{ width: `${cluster.cpuUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm">Memory Usage</span>
                                                <span className="text-sm">{cluster.memoryUsage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                                <div 
                                                    className={`h-2 rounded-full ${getUsageBgColor(cluster.memoryUsage)}`} 
                                                    style={{ width: `${cluster.memoryUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm">Disk Usage</span>
                                                <span className="text-sm">{cluster.diskUsage || 0}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                                <div 
                                                    className={`h-2 rounded-full ${getUsageBgColor(cluster.diskUsage || 0)}`} 
                                                    style={{ width: `${cluster.diskUsage || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm">Network Latency</span>
                                                <span className="text-sm">{cluster.networkLatency || 0} ms</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">No metrics available for {cluster.status.toLowerCase()} clusters</p>
                                )}
                            </div>
                            
                            {cluster.heartbeat && (
                                <div className={`p-4 mb-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <h4 className="font-medium mb-2">System Status</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-xs text-gray-500">Last Heartbeat</p>
                                            <p>{formatDate(cluster.heartbeat.lastBeat)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Heartbeat Count</p>
                                            <p>{cluster.heartbeat.count}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <h4 className="font-medium mb-2">Hardware Information</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500">CPU/GPU Model</p>
                                        <p>{cluster.gpu.type || 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Cores/Units</p>
                                        <p>{cluster.gpu.count}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                                darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsModal;