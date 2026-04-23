import {useState, useEffect, useCallback} from 'react';
import {createPortal} from 'react-dom';

/**
 * Non-intrusive newsletter modal.
 * Appears after 5 s of idle time OR when the user scrolls 40 % of the page,
 * whichever comes first. Dismissed state is persisted in sessionStorage so it
 * only shows once per session.
 */
export function NewsletterModal() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setMounted(true);

    if (sessionStorage.getItem('nl_dismissed')) return;

    let scrollTriggered = false;

    const timer = setTimeout(() => {
      if (!scrollTriggered) setIsVisible(true);
    }, 5000);

    function handleScroll() {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total > 0.4 && !scrollTriggered) {
        scrollTriggered = true;
        clearTimeout(timer);
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    }

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    sessionStorage.setItem('nl_dismissed', '1');
  }, []);

  // Keyboard: Escape closes the modal
  useEffect(() => {
    if (!isVisible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isVisible, dismiss]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    // TODO: POST to your email provider (Klaviyo / Mailchimp / Shopify marketing)
    setStatus('success');
    setTimeout(dismiss, 2800);
  }

  // Nothing rendered on the server
  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] transition-all duration-300 ${
        isVisible ? '' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-brand-black/50 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={dismiss}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nl-modal-heading"
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-[480px] bg-brand-bg shadow-2xl transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-2 text-brand-muted hover:text-brand-black transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex min-h-[340px]">
          {/* Decorative left panel */}
          <div
            aria-hidden="true"
            className="hidden sm:flex w-44 shrink-0 bg-brand-black items-center justify-center"
          >
            <svg
              width="64"
              height="96"
              viewBox="0 0 64 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-20"
            >
              <path
                d="M32 4C20 18 8 36 8 52C8 70 18 84 32 84C46 84 56 70 56 52C56 36 44 18 32 4Z"
                fill="white"
              />
              <path
                d="M32 18C24 28 16 42 16 54C16 66 23 76 32 76C41 76 48 66 48 54C48 42 40 28 32 18Z"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <p className="font-assistant text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-3">
              Exclusive Access
            </p>
            <h2
              id="nl-modal-heading"
              className="italic text-3xl font-light text-brand-black leading-tight mb-2"
            >
              Stay in the know.
            </h2>
            <p className="font-assistant text-sm text-brand-muted leading-relaxed mb-6">
              New arrivals, private drops, and offers — delivered to you first.
            </p>

            {status === 'success' ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-brand-gray flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-5 h-5 text-brand-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="italic text-xl font-light text-brand-black">
                  Welcome to the circle.
                </p>
                <p className="font-assistant text-sm text-brand-muted mt-1">
                  You'll hear from us soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Your email address"
                  className={`w-full bg-transparent border-b ${
                    status === 'error'
                      ? 'border-red-400'
                      : 'border-brand-black/30'
                  } pb-2.5 text-sm font-assistant text-brand-black placeholder-brand-muted/40 outline-none focus:border-brand-black transition-colors`}
                />
                {status === 'error' && (
                  <p className="text-xs text-red-500 mt-1.5 font-assistant">
                    Please enter a valid email address.
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full mt-5 bg-brand-black text-white py-3 text-xs font-assistant font-bold uppercase tracking-[0.2em] hover:bg-brand-black/80 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-[11px] text-brand-muted/40 font-assistant mt-4 leading-relaxed">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
