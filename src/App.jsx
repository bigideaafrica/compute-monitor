import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import { db } from './data/firebase';
import AdminRegistration from './screens/AdminRegistration';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Check if the user has admin rights
          const usersCollection = collection(db, 'users');
          const adminQuery = query(
            usersCollection, 
            where('email', '==', currentUser.email.toLowerCase()),
            where('user_type', '==', 'pol_admin')
          );
          const adminSnapshot = await getDocs(adminQuery);
          
          if (adminSnapshot.empty) {
            console.log("User is not an admin, signing out");
            toast.error("Access denied: Admin privileges required");
            await auth.signOut();
            setUser(null);
            setIsAdmin(false);
          } else {
            console.log("User verified as admin");
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          toast.error("Error verifying admin permissions");
          await auth.signOut();
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setAdminCheckComplete(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleOpenAdminPanel = () => {
    setShowAdminPanel(true);
  };
  
  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };
  
  const handleLoginSuccess = (user) => {
    setUser(user);
    setIsAdmin(true);
  };

  // Show loading screen until we've checked admin status
  if (loading || (user && !adminCheckComplete)) {
    return (
      <>
        <Toaster position="top-right" />
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-lg">Verifying access...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        {user && (
          <Navigation
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            user={user}
            onOpenAdminPanel={handleOpenAdminPanel}
          />
        )}
        
        <div className={user ? "pt-20 px-4 max-w-7xl mx-auto" : ""}>
          {user ? (
            <Dashboard darkMode={darkMode} currentUser={user} />
          ) : (
            <LoginScreen 
              darkMode={darkMode} 
              onLoginSuccess={handleLoginSuccess} 
            />
          )}
        </div>
        
        {showAdminPanel && (
          <AdminRegistration darkMode={darkMode} onClose={handleCloseAdminPanel} />
        )}
      </div>
    </>
  );
}

export default App;