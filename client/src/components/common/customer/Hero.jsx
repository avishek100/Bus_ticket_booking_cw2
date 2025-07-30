import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ✅ Import Images Correctly

const Hero = () => {
  const navigate = useNavigate();
  return (
    //     <Swiper
    //       spaceBetween={30}
    //       centeredSlides={true}
    //       loop={true}
    //       autoplay={{
    //         delay: 2500,
    //         disableOnInteraction: false,
    //       }}
    //       pagination={{
    //         clickable: true,
    //       }}
    //       navigation={true}
    //       modules={[Autoplay, Pagination, Navigation]}
    //       className="absolute top-0 left-0 w-full z-20"
    //     >
    //       {/* ✅ Slide 1 */}
    //       <SwiperSlide>
    //         <div className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-[#f5f5f5]">
    //           {/* Text Section */}
    //           <div className="md:w-1/2 text-left">
    //             <h1 className="text-4xl font-bold text-gray-800 mb-4">
    //               Your Favorite Destinations Delivered Safe & Fast.
    //             </h1>
    //             <p className="text-lg text-gray-600 mb-6">
    //               Enjoy the best journeys with reliable service, taking you straight to your destination.
    //             </p>
    //             <button
    //               onClick={() => navigate("/order")}
    //               className="bg-purple-600 text-white py-3 px-8 text-xl rounded-lg hover:bg-purple-700 transition duration-300"
    //             >
    //               View Routes
    //             </button>
    //           </div>
    //           {/* Image Section */}
    //           <div className="md:w-1/2 flex justify-center">
    //             <img src={bus2} alt="Bus Travel" className="w-full max-w-lg rounded-lg shadow-lg" />
    //           </div>
    //         </div>
    //       </SwiperSlide>

    //       {/* ✅ Slide 2 */}
    //       <SwiperSlide>
    //         <div className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-[#f5f5f5]">
    //           <div className="md:w-1/2 text-left">
    //             <h1 className="text-4xl font-bold text-gray-800 mb-4">Reliable Routes, Smart Choices.</h1>
    //             <p className="text-lg text-gray-600 mb-6">
    //               Experience comfort with every journey. Hassle-free travel awaits!
    //             </p>
    //             <button
    //               onClick={() => navigate("/order")}
    //               className="bg-purple-600 text-white py-3 px-8 text-xl rounded-lg hover:bg-purple-700 transition duration-300"
    //             >
    //               Book Now
    //             </button>
    //           </div>
    //           <div className="md:w-1/2 flex justify-center">
    //             <img src={bus4} alt="Luxury Bus" className="w-full max-w-lg rounded-lg shadow-lg" />
    //           </div>
    //         </div>
    //       </SwiperSlide>

    //       {/* ✅ Slide 3 */}
    //       <SwiperSlide>
    //         <div className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-[#f5f5f5]">
    //           <div className="md:w-1/2 text-left">
    //             <h1 className="text-4xl font-bold text-gray-800 mb-4">Explore More Destinations</h1>
    //             <p className="text-lg text-gray-600 mb-6">
    //               Enjoy quick and hassle-free bus ticket booking at your convenience.
    //             </p>
    //             <button
    //               onClick={() => navigate("/explore")}
    //               className="bg-purple-600 text-white py-3 px-8 text-xl rounded-lg hover:bg-purple-700 transition duration-300"
    //             >
    //               Explore More
    //             </button>
    //           </div>
    //           <div className="md:w-1/2 flex justify-center">
    //             <img src={bus4} alt="Quick Booking" className="w-full max-w-lg rounded-lg shadow-lg" />
    //           </div>
    //         </div>
    //       </SwiperSlide>
    //     </Swiper>
    //   );
    // };
    // <div className="relative w-full h-[500px] overflow-hidden">
    //   <video
    //     autoPlay
    //     loop
    //     muted
    //     playsInline
    //     className="absolute w-full h-full object-cover"
    //   >
    //     <source src="/videos/hero.mp4" type="video/mp4" />
    //     Your browser does not support the video tag.
    //   </video>



    //   {/* Overlay Content */}
    //   <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
    //     <div className="text-center px-4">
    //       <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
    //         Your Favorite Destinations Delivered Safe & Fast.
    //       </h1>
    //       <p className="text-lg text-white mb-6">
    //         Enjoy the best journeys with reliable service, taking you straight to your destination.
    //       </p>
    //       <button
    //         onClick={() => navigate("/order")}
    //         className="bg-purple-600 text-white py-3 px-8 text-xl rounded-lg hover:bg-purple-700 transition duration-300"
    //       >
    //         View Routes
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="relative w-full h-[600px] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10 dark:bg-gray-900 dark:bg-opacity-70">
        <div className="text-center px-4 text-white dark:text-foreground">
          <h1 className="text-5xl font-bold mb-4">
            Your Favorite Destinations Delivered Safe & Fast.
          </h1>
          <p className="text-xl mb-6">
            Enjoy the best journeys with reliable service, taking you straight to your destination.
          </p>
          {/*<button*/}
          {/*  onClick={() => navigate("/order")}*/}
          {/*  className="bg-red-500 text-white py-3 px-8 text-xl rounded-lg hover:bg-purple-700 transition duration-300"*/}
          {/*>*/}

          {/*</button>*/}
        </div>
      </div>
    </div>


  )
}
export default Hero;
