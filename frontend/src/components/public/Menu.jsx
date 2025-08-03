import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";

const Menu = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/category/getCategories");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:3000/api/v1/item/getItems";
        if (category) {
          url = `http://localhost:3000/api/v1/item/getItems/category/${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        let items = data.data || [];

        if (sortOption === "low-to-high") {
          items.sort((a, b) => a.price - b.price);
        } else if (sortOption === "high-to-low") {
          items.sort((a, b) => b.price - a.price);
        } else if (sortOption === "above-500") {
          items = items.filter((item) => item.price > 500);
        } else if (sortOption === "below-500") {
          items = items.filter((item) => item.price <= 500);
        } else if (sortOption === "between-1000-2000") {
          items = items.filter((item) => item.price >= 1000 && item.price <= 2000);
        }

        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortOption]);

  return (
    <>
      <Layout />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
        </div>
        
        <div className="flex p-6 mt-[-40px] h-full relative z-10">
          {/* Left Sidebar */}
          <div className="w-1/4 mt-10 p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Product Categories
                </h2>
              </div>
              <select
                className="border-2 border-gray-300 p-4 w-full mb-4 text-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="text-black">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="text-black">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Container */}
          <div className="w-3/4 p-4 mt-10 flex flex-col relative">
            {/* Sorting */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18M3 12h18M3 16h18" />
                  </svg>
                </div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Sort Products
                </h2>
              </div>
              <select
                className="border-2 border-gray-300 p-4 w-full text-gray-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="" className="text-black">
                  Default Sorting
                </option>
                <option value="low-to-high" className="text-black">
                  Price: Low to High
                </option>
                <option value="high-to-low" className="text-black">
                  Price: High to Low
                </option>
                <option value="above-500" className="text-black">
                  Price: Above $50
                </option>
                <option value="below-500" className="text-black">
                  Price: Below $50
                </option>
                <option value="between-1000-2000" className="text-black">
                  Price: $20 - $100
                </option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-3">
                  <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-700">Loading cases...</span>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 group"
                    onClick={() => navigate(`/item/details/${product._id}`)}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={`http://localhost:3000/uploads/${product.image}`}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        New
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : !loading ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No cases found</h3>
                  <p className="text-gray-500">Try adjusting your filters or browse our full collection</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Menu;
