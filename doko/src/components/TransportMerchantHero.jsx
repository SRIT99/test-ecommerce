import { Link } from "react-router-dom";
const TransportMerchantHero = () => {
  return (
    <section className="bg-primary dark:bg-slate-900 text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Drive the Future of Agriculture 🚚
        </h1>
        <p className="text-lg md:text-xl text-slate-100 mb-8">
          Join DOKO as a transportation merchant and help deliver fresh produce across Nepal. 
          Be part of a trusted network that connects farmers to markets—one kilometer at a time.
        </p>
        <Link
          to="/merchant/apply"
          className="inline-block bg-white text-primary dark:text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-slate-100 transition"
        >
          Apply Now
        </Link>
      </div>
    </section>
  );
};

export default TransportMerchantHero;
