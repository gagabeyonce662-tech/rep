import {useLayoutEffect, useRef, useState} from 'react';

export function ProductDescription({html}: {html: string}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const check = () => {
      const capPx = parseFloat(getComputedStyle(el).fontSize) * 16;
      setOverflows(el.scrollHeight > capPx + 4);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html]);

  if (!html) return null;

  const collapsed = overflows && !expanded;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-black/50">
        Description
      </p>
      <div
        className="product-description-wrap"
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        <div
          ref={contentRef}
          className="product-description"
          dangerouslySetInnerHTML={{__html: html}}
        />
      </div>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="self-start text-xs uppercase tracking-[0.2em] text-brand-black/70 hover:text-brand-black transition-colors pt-1 border-b border-brand-black/30 hover:border-brand-black pb-0.5"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
