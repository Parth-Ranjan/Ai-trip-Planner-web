

import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
 
  return (
    <div>
      <h2 className="text-xl font-bold">Hotel Recommendation</h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4  gap-6 mt-5">
        {trip?.generatedPlan?.hotels?.map((hotel, index) => (
          <div key={index}><HotelCardItem hotel={hotel}/></div>
         
        ))}
      </div>
    </div>
  );
}

export default Hotels;
