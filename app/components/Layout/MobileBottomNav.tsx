import { Link } from 'react-router';
import { Globe, User, Plus, MapPin, Search } from 'lucide-react';

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-4 inset-x-4 z-50 flex items-center justify-around bg-white/10  border border-white/30  backdrop-blur-xl px-4 py-3 md:hidden rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden ">

      {/* Liquid Shine Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none rounded-full" />
      <Link
        to="/collections/all"
        className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100"
      >
        <Globe className='h-6 w-6' strokeWidth={1.5} />
      </Link>

      <Link
        to="/account"
        className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100"
      >
        <User className="h-6 w-6" strokeWidth={1.5} />

      </Link>

      <div className="flex rounded-full items-center justify-center bg-brand-black p-3 text-brand-bg opacity-80 ">
        <Plus className="h-6 w-6" strokeWidth={2} />

      </div>

      <Link
        to="/pages/store"
        className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100"
      >
        <MapPin className="h-6 w-6" strokeWidth={1.5} />
      </Link>

      <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100">
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

