const backers = [
  "PhonePe",
  "Zerodha",
  "Flipkart",
  "CRED",
  "Rapido",
  "1mg",
  "Microsoft",
];

export default function BackersSection() {
  return (
    <section className="py-14 border-y border-line bg-soft">
      <div className="container-x">
        <p className="text-center text-[11px] font-bold tracking-[0.18em] uppercase text-[#888] mb-8">
          Backed by founders and operators from
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {backers.map((name) => (
            <span
              key={name}
              className="text-[22px] sm:text-[26px] font-black tracking-[-0.04em] text-[#aaa]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
