import React, { useState,useEffect } from 'react'
import { Button } from '../ui/button'
import { GetPlaceDetails } from '@/service/GlobalApi'
const PHOTO_REF_URL="https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=600&key="+import.meta.env.VITE_GOOGLE_MAPS_API_KEY
function InfoSection({trip}) {
 const [placePhoto,setPlacePhoto]=useState();
  useEffect(()=>{
    trip && GetPlacePhoto()
  },[trip])
  const GetPlacePhoto=async()=>{
    const data={
      textQuery:trip?.userSelection?.location
    }
    const result=await GetPlaceDetails(data).then(resp=>{
      console.log(resp.data.places[0].photos[3].name)
      const PhotoUrl=PHOTO_REF_URL.replace("{NAME}",resp.data.places[0].photos[9].name)
      setPlacePhoto(PhotoUrl)
    })
  }
  return (
    <div>
      <img src={placePhoto} className='h-[340px] w-full object-cover rounded-xl'/>
      <div className="my-5 flex flex-col gap-2">
        <h2 className='text-2xl font-bold'>{trip?.userSelection?.location}</h2>
        <div className='flex gap-5'>
            <Button><h2 className="p-1 px-3 text-sm">{trip?.userSelection?.noOfDays} Days 📆</h2></Button>
            <Button><h2 className="p-1 px-3 text-sm">{trip?.userSelection?.budget} Budget 💰</h2></Button>
            <Button><h2 className="p-1 px-3 text-sm">🥂 {trip?.userSelection?.noOfpeople}</h2></Button>
        </div>
      </div>   
    </div>
  )
}

export default InfoSection