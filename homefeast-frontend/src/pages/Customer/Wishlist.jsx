import { Link } from 'react-router-dom';

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
          Saved <span className="text-[#F43F5E]">Kitchens</span>
        </h1>

        <div className="bg-[#111827] border border-[#263241] border-dashed rounded-3xl p-16 text-center shadow-lg">
          <div className="w-20 h-20 bg-[#F43F5E]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#F43F5E]/20">
            <svg className="w-10 h-10 text-[#F43F5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">No favorites yet!</h2>
          <p className="text-[#94A3B8] mb-8 max-w-md mx-auto">Found a kitchen you love? Hit the heart icon to save it here for quick access later.</p>
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 bg-[#263241] hover:bg-[#334155] text-[#F8FAFC] font-bold px-8 py-3 rounded-full transition-colors"
          >
            Find Kitchens
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Wishlist;