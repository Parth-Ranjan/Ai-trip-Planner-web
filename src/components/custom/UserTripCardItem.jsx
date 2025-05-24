import React, { useState, useEffect } from 'react';
import { PHOTO_REF_URL, GetPlaceDetails } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function UserTripCardItem({ trip }) {
  const [placePhoto, setPlacePhoto] = useState(null);

  useEffect(() => {
    if (trip) fetchPlacePhoto();
  }, [trip]);

  const fetchPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location,
      };
      const resp = await GetPlaceDetails(data);
      const photos = resp?.data?.places?.[0]?.photos || [];
      const photoName = photos[3]?.name || photos[0]?.name;
      if (photoName) {
        const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
        setPlacePhoto(photoUrl);
      }
    } catch (err) {
      console.error('Error fetching photo:', err);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="h-48 w-full bg-gray-200">
        {placePhoto ? (
          <img
            src={placePhoto}
            alt={trip?.userSelection?.location || 'Trip Image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-semibold capitalize">
          {trip?.userSelection?.location || 'Unknown Location'}
        </h2>
        <p className="text-sm text-gray-600">
          {trip?.userSelection?.noOfDays} Days trip with{' '}
          {trip?.userSelection?.noOfpeople} people
        </p>
        <p className="text-sm text-gray-600">Budget: {trip?.userSelection?.budget}</p>

        {/* Button */}
        <Link to={`/view-trip/${trip?.id}`} className="mt-4">
          <Button className="w-full cursor-pointer">View Trip</Button>
        </Link>
      </div>
    </div>
  );
}

export default UserTripCardItem;
