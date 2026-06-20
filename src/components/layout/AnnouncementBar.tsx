'use client';

import { useEffect, useState } from 'react';
import { announcements } from '@/lib/data';

interface TickerItem {
  category: string;
  copy: string;
}

const STATIC: TickerItem[] = announcements.map(a => ({ category: 'KALVIUMX', copy: a }));

export default function AnnouncementBar() {
  const [items, setItems] = useState<TickerItem[]>(STATIC);

  useEffect(() => {
    fetch('/api/ticker')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="h-10 bg-ink text-white flex items-center overflow-hidden text-sm font-medium">
      <div className="flex gap-20 whitespace-nowrap animate-marquee w-max">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 24 24"
              className="w-[18px] h-[18px] stroke-white fill-none"
              strokeWidth="1.8"
            >
              <path d="M4 13h4l9 5V6l-9 5H4v2Z" />
              <path d="M19 9c1 1 1 5 0 6" />
            </svg>
            <span>
              <span className="text-red font-extrabold text-[11px] tracking-[0.12em] mr-2">
                {item.category}
              </span>
              {item.copy}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
