import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] bg-[#080D12] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-black text-[#111827] drop-shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-4 tracking-tighter">
        404
      </h1>
      <h2 className="text-3xl font-bold text-[#F8FAFC] mb-4">Page Not Found</h2>
      <p className="text-[#94A3B8] max-w-md mx-auto mb-8">
        Oops! It looks like you've wandered into a kitchen that doesn't exist. Let's get you back to the fresh homemade meals.
      </p>
      <Link 
        to="/"
        className="bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;