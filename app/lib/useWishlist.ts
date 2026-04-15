import {useState, useEffect, useCallback} from 'react';

const WISHLIST_KEY = 'hydrogen_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Initialize from local storage on client side
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse wishlist from local storage', e);
    }
  }, []);

  const saveWishlist = useCallback((newWishlist: string[]) => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
      setWishlist(newWishlist);
      // Dispatch a custom event so other components (like Header) can update
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (e) {
      console.warn('Failed to save wishlist to local storage', e);
    }
  }, []);

  const addToWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        saveWishlist(next);
        return next;
      });
    },
    [saveWishlist],
  );

  const removeFromWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const next = prev.filter((itemId) => itemId !== id);
        saveWishlist(next);
        return next;
      });
    },
    [saveWishlist],
  );

  const toggleWishlist = useCallback(
    (id: string) => {
      if (wishlist.includes(id)) {
        removeFromWishlist(id);
      } else {
        addToWishlist(id);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist],
  );

  const isInWishlist = useCallback(
    (id: string) => {
      return wishlist.includes(id);
    },
    [wishlist],
  );

  // Sync state if it changes in another tab or component
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = window.localStorage.getItem(WISHLIST_KEY);
        if (stored) {
          setWishlist(JSON.parse(stored));
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('wishlist-updated', handleStorageChange);
    return () => {
      window.removeEventListener('wishlist-updated', handleStorageChange);
    };
  }, []);

  return {
    wishlistItems: wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };
}
