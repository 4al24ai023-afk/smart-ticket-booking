import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const lowestPrice = Math.min(...event.tiers.map(t => t.price));
  const isSoldOut = event.remainingCapacity <= 0 || event.status === 'sold_out';
  const capacityPercent = Math.max(0, Math.min(100, Math.round((event.remainingCapacity / event.totalCapacity) * 100)));

  return (
    <div className="group flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/5">
      
      {/* Event Image Banner with measured scrim */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Styled CSS fallback container on image error
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Category & Status Overlay (clean text, no garish pill sandwich) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="font-semibold text-indigo-300 drop-shadow-md">
            {event.category}
          </span>
          {isSoldOut ? (
            <span className="font-bold text-rose-400 drop-shadow-md">
              SOLD OUT
            </span>
          ) : event.remainingCapacity < 30 ? (
            <span className="font-semibold text-amber-400 drop-shadow-md">
              {event.remainingCapacity} Left
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{event.city}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>
        </div>

        {/* Capacity Progress Bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-500" />
              <span>Remaining Capacity</span>
            </span>
            <span className="tabular-nums font-semibold text-slate-300">
              {event.remainingCapacity} / {event.totalCapacity}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSoldOut
                  ? 'bg-rose-500'
                  : capacityPercent < 20
                  ? 'bg-amber-400'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-[11px] text-slate-500">Tickets from</div>
              <div className="text-lg font-extrabold text-white tabular-nums">
                ₹{lowestPrice.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={() => onSelect(event)}
              disabled={isSoldOut}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                isSoldOut
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 group-hover:translate-x-0.5'
              }`}
            >
              <span>{isSoldOut ? 'Sold Out' : 'Book Now'}</span>
              {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
