import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useId} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'notifications' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();
    if (expanded) {
      document.body.style.overflow = 'hidden';
      document.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
          if (event.key === 'Escape') close();
        },
        {signal: abortController.signal},
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      abortController.abort();
      document.body.style.overflow = '';
    };
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        expanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-labelledby={id}
    >
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm" 
        onClick={close} 
      />
      
      {/* Aside Content */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-brand-bg border-l border-brand-line transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between h-16 px-6 border-b border-brand-line">
          <h3 id={id} className="italic text-xl font-light tracking-[-0.01em]">
            {heading}
          </h3>
          <button 
            className="p-2 -mr-2 text-brand-black hover:opacity-50 transition-opacity" 
            onClick={close} 
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="h-[calc(100vh-64px)] overflow-y-auto p-6 font-assistant">
          {children}
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
