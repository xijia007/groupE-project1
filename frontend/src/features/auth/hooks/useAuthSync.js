import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to sync auth state with localStorage changes
 * Useful when token is cleared by other components
 */
export function useAuthSync() {
    const { refreshFromStorage } = useAuth();

    useEffect(() => {
        // Listen for storage changes from other tabs/windows
        const handleStorageChange = (e) => {
            if (e.key === 'accessToken') {
                refreshFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events within the same tab
        const handleTokenChange = () => {
            refreshFromStorage();
        };

        window.addEventListener('tokenChanged', handleTokenChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('tokenChanged', handleTokenChange);
        };
    }, [refreshFromStorage]);
}
