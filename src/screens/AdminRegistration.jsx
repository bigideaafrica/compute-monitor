import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { AlertTriangle, Check, Mail, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { db } from '../data/firebase';

const AdminRegistration = ({ darkMode, onClose }) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingAdmins, setExistingAdmins] = useState([]);
  const [fetchingAdmins, setFetchingAdmins] = useState(true);

  useEffect(() => {
    const fetchExistingAdmins = async () => {
      try {
        setFetchingAdmins(true);
        const usersCollection = collection(db, 'users');
        const adminQuery = query(usersCollection, where('user_type', '==', 'pol_admin'));
        const adminSnapshot = await getDocs(adminQuery);
        
        const admins = adminSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            displayName: data.displayName,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Unknown'
          };
        });
        
        setExistingAdmins(admins);
      } catch (error) {
        console.error("Error fetching existing admins:", error);
        setError("Failed to fetch existing administrators");
      } finally {
        setFetchingAdmins(false);
      }
    };
    
    fetchExistingAdmins();
  }, []);

  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    
    if (!email || !displayName) {
      setError("Email and name are required");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Check if user already exists with this email
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('email', '==', email.toLowerCase()));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        // User exists - update their user_type to pol_admin
        const userDoc = userSnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          user_type: 'pol_admin',
          displayName: displayName
        });
        
        setSuccess(true);
        setEmail('');
        setDisplayName('');
        
        // Refresh the admin list
        const adminQuery = query(usersCollection, where('user_type', '==', 'pol_admin'));
        const adminSnapshot = await getDocs(adminQuery);
        
        const admins = adminSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            displayName: data.displayName,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Unknown'
          };
        });
        
        setExistingAdmins(admins);
        return;
      }
      
      // User doesn't exist - create a new account
      const auth = getAuth();
      
      // Generate a random password
      const randomPassword = Math.random().toString(36).slice(-8);
      
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, randomPassword);
      const user = userCredential.user;
      
      // Create the user document in Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: email.toLowerCase(),
        displayName: displayName,
        user_type: 'pol_admin',
        createdAt: new Date()
      });
      
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      setSuccess(true);
      setEmail('');
      setDisplayName('');
      
      // Refresh the admin list
      const adminQuery = query(usersCollection, where('user_type', '==', 'pol_admin'));
      const adminSnapshot = await getDocs(adminQuery);
      
      const admins = adminSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          displayName: data.displayName,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Unknown'
        };
      });
      
      setExistingAdmins(admins);
    } catch (error) {
      console.error("Error registering admin:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative w-full max-w-2xl p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Registration
          </h2>
          <button
            onClick={onClose}
            className={`rounded-full p-1 ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <form onSubmit={handleRegisterAdmin} className="mb-4">
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    className={`block w-full pl-8 pr-2 py-2 text-sm border rounded ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Admin Name"
                    className={`block w-full pl-8 pr-2 py-2 text-sm border rounded ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className={`p-2 mb-4 rounded text-sm flex items-center gap-2 ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className={`p-2 mb-4 rounded text-sm flex items-center gap-2 ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'}`}>
                  <Check className="w-4 h-4" />
                  Administrator successfully registered! A password reset email has been sent.
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded ${
                  loading
                    ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                    : `${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`
                }`}
              >
                {loading ? 'Registering...' : 'Register Admin'}
              </button>
            </form>
            
            <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} text-xs`}>
              <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Info</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Registered admins will receive a password reset email to set their password.
                They will have access to all administrative functions with the 'pol_admin' role.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Existing Administrators
            </h3>
            
            <div className={`border rounded ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-[300px] overflow-auto`}>
              {fetchingAdmins ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm text-gray-500">Loading administrators...</p>
                </div>
              ) : existingAdmins.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm text-gray-500">No administrators found</p>
                </div>
              ) : (
                <table className={`w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <thead className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingAdmins.map((admin) => (
                      <tr key={admin.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                        <td className="px-4 py-2">{admin.displayName}</td>
                        <td className="px-4 py-2">{admin.email}</td>
                        <td className="px-4 py-2">{admin.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;