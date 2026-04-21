
export default function Marquee() {
    const words = [
        'Rep',
        '◦',
        'Worldwide',
        '◦',
        'Limited Edition',
        '◦',
        'Crafted with Care',
        '◦',
    ];
    const loop = Array.from({ length: 4 }, (_, i) =>
        words.map((w, j) => ({ id: `${i}-${j}-${w}`, word: w })),
    ).flat();
    return (
        <section className="border-y border-brand-line py-6 md:py-8 overflow-hidden bg-brand-bg">
            <div className="flex w-max animate-marquee whitespace-nowrap">
                {loop.map((item) => (
                    <span
                        key={item.id}
                        className="text-3xl md:text-5xl font-semibold uppercase tracking-[0.08em] px-6 md:px-10 text-brand-black"
                    >
                        {item.word}
                    </span>
                ))}
            </div>
        </section>
    );
}
