import React, { useState, useEffect } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';

function HotelCardItem({ hotel,index }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName
    };
    const result = await GetPlaceDetails(data).then(resp => {
      const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", resp.data.places[0].photos[0].name);
      setPhotoUrl(PhotoUrl);
    });
  };

  return (
    <div>
      <a key={index}
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${hotel.hotelName}, ${hotel.hotelAddress}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-[400px] w-full rounded-xl border border-gray-300 shadow-md hover:shadow-lg 
                   transition-transform duration-300 transform hover:scale-105 
                   p-4 flex flex-col bg-amber-200 cursor-pointer"
      >
        <img
          src={photoUrl}
          alt={hotel.hotelName}
          className="h-[160px] w-full object-cover rounded-lg mb-3"
        />

        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {hotel.hotelName}
        </h2>

        <div className="text-sm text-gray-600 mt-1 flex items-start">
          <span className="mr-1">📍</span>
          <span className="truncate">{hotel.hotelAddress}</span>
        </div>

        <div className="text-sm text-gray-700 mt-2 line-clamp-2">
          {hotel.description}
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 text-sm font-medium">
          <span className="text-green-700">💰 ₹{hotel.price}</span>
          <span>⭐ {hotel.rating}</span>
        </div>
      </a>
    </div>
  );
}

export default HotelCardItem;
