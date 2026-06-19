import { announcements } from "@/lib/data";

export default function AnnouncementBar() {
  const doubled = [...announcements, ...announcements];
  return (
    <div className="h-10 bg-ink text-white flex items-center overflow-hidden text-sm font-medium">
      <div className="flex gap-20 whitespace-nowrap animate-marquee w-max">
        {doubled.map((message, i) => (
          <div key={`${message}-${i}`} className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 24 24"
              className="w-[18px] h-[18px] stroke-white fill-none"
              strokeWidth="1.8"
            >
              <path d="M4 13h4l9 5V6l-9 5H4v2Z" />
              <path d="M19 9c1 1 1 5 0 6" />
            </svg>
            <span>{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
