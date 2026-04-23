import { Link } from 'react-router';
import { Globe, User, Plus, MapPin, Search } from 'lucide-react';

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-3 inset-x-6 z-50 flex items-center justify-around bg-white/[0.14] border border-white/35 backdrop-blur-2xl backdrop-saturate-150 px-4 py-2.5 md:hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.45)] overflow-hidden relative">

      {/* Liquid Shine Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full opacity-70"
        style={{
          background:
            'linear-gradient(130deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0.00) 70%)',
          clipPath: 'ellipse(85% 60% at 50% 0%)',
        }}
      />
      <div className="absolute -top-8 -left-6 h-20 w-28 rounded-full bg-white/20 blur-2xl pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/5 pointer-events-none" />
      <Link
        to="/collections/all"
        className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-all"
      >
        <Globe className='h-6 w-6' strokeWidth={1.5} />
      </Link>

      <Link
        to="/account"
        className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-all"
      >
        <User className="h-6 w-6" strokeWidth={1.5} />

      </Link>

      <div className="flex rounded-full items-center justify-center bg-brand-black/85 p-3 text-brand-bg opacity-95 ring-1 ring-white/35 shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
        <Plus className="h-6 w-6" strokeWidth={2} />

      </div>

      <Link
        to="/pages/store"
        className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-all"
      >
        <MapPin className="h-6 w-6" strokeWidth={1.5} />
      </Link>

      <button className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-all">
        <Search className="h-6 w-6" strokeWidth={1.5} />

      </button>
      {/* Add this SVG at the bottom of your MobileBottomNav component */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="frosted" primitiveUnits="objectBoundingBox">
          {/* This base64 is the 'refraction' map */}
          <feImage
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6e..."
            x="0" y="0" width="1" height="1" result="map"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
          <feDisplacementMap id="disp" in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G">
            {/* These animations make it feel 'liquid' on hover/interaction */}
            <animate attributeName="scale" to="1.4" dur="0.3s" begin="mouseenter" fill="freeze" />
            <animate attributeName="scale" to="1" dur="0.3s" begin="mouseleave" fill="freeze" />
          </feDisplacementMap>
        </filter>
      </svg>
    </nav>
  );
}

