import React, { useState, useEffect } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { Button } from '../ui/button';


function PlaceCardItem({ places, index }) {
  const [photoUrls, setPhotoUrls] = useState({});

  useEffect(() => {
    places.forEach(async (place, idx) => {
      const data = {
        textQuery: place?.placeName,
      };

      try {
        const resp = await GetPlaceDetails(data);
        const photoName = resp?.data?.places?.[0]?.photos?.[1]?.name;
        if (photoName) {
          const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
          setPhotoUrls(prev => ({ ...prev, [idx]: photoUrl }));
        }
      } catch (error) {
        console.error(`Error fetching photo for ${place?.placeName}:`, error);
      }
    });
  }, [places]);

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-4 capitalize">{`Day ${index + 1}`}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {places.map((place, idx) => (
          <div className="relative border border-gray-300 p-4 rounded-xl shadow-sm flex gap-4 bg-amber-200 h-60 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            key={idx}
            
          >
            {/* Image */}
            
            {photoUrls[idx] ? (
              <img
                src={photoUrls[idx]}
                alt={place.placeName}
                className="w-28 h-28 object-cover mt-8 rounded-lg self-start shrink-0"
              /> 
            ) : (
              <div className="w-28 h-28 mt-8 bg-gray-300 rounded-lg animate-pulse" />
            )}
            
           
            {/* Content */}
            <div className="flex-1 flex flex-col">
              <div>
                <h4 className="text-lg font-bold mb-1">
                  {place.placeName || 'Unknown Place'}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                  {place.placeDetails || 'No details available.'}
                </p>
              </div>

              <div className="text-sm text-gray-700 grid grid-cols-2 gap-y-1 mt-1">
                <span>🕒 {place.timeToTravel || 'Not mentioned'}</span>
                <span>⭐ {place.rating !== undefined ? place.rating : 'N/A'}</span>
                <span>💰 {place.ticketPricing > 0 ? `₹${place.ticketPricing}` : 'Free'}</span>
                <span>🌅 {place.bestTimeToVisit || 'Anytime'}</span>
              </div>

              <div className="mt-auto self-end flex-shrink-1">
                {place.geoCoordinates ? (
                  <a
                    href={`https://www.google.com/maps?q=${place.geoCoordinates.lat},${place.geoCoordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="cursor-pointer">📍 View on Map</Button>
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs italic">Map not available</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceCardItem;

