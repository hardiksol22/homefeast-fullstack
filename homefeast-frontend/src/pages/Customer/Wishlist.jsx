import { Link } from 'react-router-dom';

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h1 className="text-3xl font-black tracking-tight text-[#F8FAFC]">
            Saved <span className="text-rose-500">Kitchens</span>
          </h1>
        </div>

        {/* Empty State Fallback */}
        <div className="text-center py-20 bg-[#111827] border border-[#263241] rounded-3xl">
          <svg className="w-16 h-16 text-[#263241] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-xl font-bold text-[#F8FAFC]">Your wishlist is empty</h3>
          <p className="text-[#94A3B8] mt-2 mb-6">Explore tiffins and tap the heart icon to save your favorites.</p>
          <Link to="/customer" className="px-6 py-3 bg-[#10B981] text-[#080D12] font-bold rounded-xl hover:bg-[#059669] transition-colors">
            Explore Tiffins
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;