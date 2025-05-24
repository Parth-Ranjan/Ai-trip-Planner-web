import React,{useEffect,useState} from 'react'
import { db } from '@/service/FirebaseConfig'
import {doc,getDoc} from "firebase/firestore"
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import InfoSection from '@/components/custom/InfoSection'
import Hotels from '@/components/custom/Hotels'
import PlacestoVisit from '@/components/custom/PlacestoVisit'


function ViewTrip() {
    const[tripData,setTripData]=useState(null);
    const {tripId}=useParams();
    useEffect(()=>{
        tripId && GetTripData();
    },[tripId])
    const GetTripData=async()=>{
        const docRef=doc(db,"AITrips",tripId);
        const docSnap=await getDoc(docRef);
        if(docSnap.exists()){
            console.log("Document:",docSnap.data());
            setTripData(docSnap.data());
        }
        else{
            console.log("No such Document")
            toast("No trip found")
        }
    }

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      
    {/*Information Section*/}
      <InfoSection trip={tripData}/>
    {/*Recommended Hotels*/}
      <Hotels trip={tripData}/>

    {/*Daily Plans*/}
      <PlacestoVisit trip={tripData}/>

 
    </div>
  )
}

export default ViewTrip