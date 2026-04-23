export function ProductReviews() {
  return (
    <div className="product-reviews pt-16 pb-24 border-t border-brand-line mt-12 w-full flex flex-col items-center">
      <h3 className="text-3xl md:text-4xl text-brand-black mb-8 tracking-[-0.01em]">
        Customer Reviews
      </h3>
      <div className="flex flex-col items-center mb-12">
        <div className="flex text-brand-black mb-2 gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-6 h-6 fill-brand-black" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <p className="font-assistant text-lg tracking-wide text-brand-black">5.00 out of 5</p>
        <p className="font-light text-brand-muted mt-1">Based on 3 reviews</p>
        <button className="mt-6 px-10 py-3 bg-brand-black text-white uppercase tracking-widest text-sm hover:bg-brand-gray hover:text-brand-black hover:border-brand-black border border-transparent transition-all">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {REVIEWS.map((review, i) => (
          <div key={i} className="flex flex-col p-6 border border-brand-line bg-white/50">
            <div className="flex text-brand-black gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 fill-brand-black" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-brand-black mb-2">"{review.title}"</p>
            <p className="font-light text-brand-black/80 flex-grow mb-6 leading-relaxed">
              {review.body}
            </p>
            <div className="border-t border-brand-line pt-4 flex justify-between items-center text-sm text-brand-muted">
              <span>{review.author}</span>
              <span>{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const REVIEWS = [
  {
    title: 'Absolutely love it',
    body: 'The quality is fantastic and it fits perfectly with my aesthetic. Will be buying more soon!',
    author: 'Sarah M.',
    date: '2 days ago',
  },
  {
    title: 'Exceeded expectations',
    body: 'I was hesitant at first, but this is the best purchase I have made all year. Highly recommended.',
    author: 'James T.',
    date: '1 week ago',
  },
  {
    title: 'Beautiful craftsmanship',
    body: 'You can really feel the attention to detail. It arrived quickly and was packaged beautifully.',
    author: 'Elena R.',
    date: '3 weeks ago',
  },
];
