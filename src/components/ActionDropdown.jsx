/* eslint-disable react/prop-types */
import { BarChart2, CheckCircle, Layers, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const ActionDropdown = ({ onRename, onValidate, onDelete, onViewMetrics, onViewPods, clusterStatus, validationStatus, darkMode }) => {
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
                className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <MoreHorizontal className={`w-3 h-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={handleClickOutside}
                    />
                    <div className={`absolute right-0 mt-1 w-40 rounded shadow-lg border z-20 py-0.5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        {onViewMetrics && (
                            <button
                                onClick={() => {
                                    onViewMetrics();
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-1 text-xs text-left flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                disabled={clusterStatus === 'Failed' || clusterStatus === 'Terminated'}
                            >
                                <BarChart2 className="w-3 h-3" strokeWidth={1.5} />
                                View Metrics
                            </button>
                        )}
                        {onViewPods && (
                            <button
                                onClick={() => {
                                    onViewPods();
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-1 text-xs text-left flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                disabled={clusterStatus === 'Failed' || clusterStatus === 'Terminated'}
                            >
                                <Layers className="w-3 h-3" strokeWidth={1.5} />
                                View Pods
                            </button>
                        )}
                        <button
                            onClick={() => {
                                onRename();
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-1 text-xs text-left flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                            <Pencil className="w-3 h-3" strokeWidth={1.5} />
                            Rename
                        </button>
                        <button
                            onClick={() => {
                                onValidate ? onValidate() : null;
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-1 text-xs text-left flex items-center gap-1 ${
                                darkMode 
                                    ? (validationStatus === 'Verified' ? 'text-orange-400 hover:bg-gray-700' : 'text-green-400 hover:bg-gray-700')
                                    : (validationStatus === 'Verified' ? 'text-orange-600 hover:bg-gray-50' : 'text-green-600 hover:bg-gray-50')
                            }`}
                        >
                            <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                            {validationStatus === 'Verified' ? 'Unvalidate' : 'Validate'}
                        </button>
                        <button
                            onClick={() => {
                                onDelete ? onDelete() : null;
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-1 text-xs text-left flex items-center gap-1 ${
                                darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'
                            }`}
                        >
                            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ActionDropdown;