import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { budgetOptions, companions } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FcGoogle } from "react-icons/fc";
import generateTravelPlanFromData from '@/service/AIModal';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { db } from '@/service/FirebaseConfig'; // ✅ Import your Firebase config
import { setDoc, doc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";


function CreateTrip() {
  const [places, setPlaces] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log('Form Data:', formData);
  }, [formData]);

 

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse?.access_token}`, {
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
            Accept: 'application/json',
          },
        });

        localStorage.setItem('user', JSON.stringify(res.data));
        setDialogOpen(false);
        handleCreateTrip(); // Retry after login
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        toast.error('Google login failed');
      }
    },
    onError: (err) => {
      console.error('Login Failed:', err);
      toast.error('Google login failed');
    }
  });
  const SaveAiTrip = async (tripData) => {
    try {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      const docId = Date.now().toString();

      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        generatedPlan:tripData ,
        userEmail: userData?.email,
        id: docId,
      });
      navigate('/view-trip/'+docId);

      toast.success('Trip saved successfully!');
    } catch (error) {
      console.error("Failed to save trip:", error);
      toast.error('Error saving trip.');
    }
    
  };
  
  
  const handleCreateTrip = async () => {
    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.noOfpeople) {
      toast.error('Please fill in all the required details (Destination, Days, Budget, Travelers).');
      return;
    }

    const user = localStorage.getItem('user');
    if (!user) {
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    setGeneratedPlan(null);
   
    try {
      const plan = await generateTravelPlanFromData(formData);
      setGeneratedPlan(plan);
      SaveAiTrip(plan)
      
       // ✅ Save trip to Firestore
    } catch (error) {
      console.error('Error generating trip:', error);
      toast.error('Failed to generate travel plan.');
    } finally {
      setLoading(false);
    }
   
    

    
      
  };
  


  return (
  
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='text-gray-500 text-xl mt-3'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-20 flex flex-col gap-10'>
        {/* Destination */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is the destination of your choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            selectProps={{
              value: places,
              onChange: (v) => {
                setPlaces(v);
                handleInputChange('location', v.label);
              },
              placeholder: "Enter your destination",
            }}
          />
        </div>

        {/* No of days */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning for your trip?</h2>
          <Input
            placeholder="Example: 3"
            type="number"
            onChange={(e) => handleInputChange('noOfDays', parseInt(e.target.value))}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is your budget for the trip?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {budgetOptions.map((option) => (
              <div
                onClick={() => handleInputChange('budget', option.title)}
                key={option.id}
                className={`rounded-lg border-2 p-5 flex flex-col items-center justify-center gap-3 hover:shadow-lg cursor-pointer
                  ${formData.budget === option.title ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
              >
                <h2 className='text-4xl'>{option.emoji}</h2>
                <h2 className='font-bold text-lg'>{option.title}</h2>
                <h2 className='text-md text-gray-500'>{option.description}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Companions */}
        <div>
          <h2 className="text-xl my-3 font-medium">Who are you traveling with?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {companions.map((option) => (
              <div
                onClick={() => handleInputChange('noOfpeople', option.noOfpeople)}
                key={option.id}
                className={`rounded-lg border-2 p-5 flex flex-col items-center justify-center gap-3 hover:shadow-lg cursor-pointer
                  ${formData.noOfpeople === option.noOfpeople ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
              >
                <h2 className='text-4xl'>{option.emoji}</h2>
                <h2 className='font-bold text-lg'>{option.title}</h2>
                <h2 className='text-md text-gray-500'>{option.description}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Create Trip Button */}
        <div className='flex justify-end my-10'>
          <Button onClick={handleCreateTrip} disabled={loading}>
            {loading ? 'Generating Trip...' : 'Create Trip'}
          </Button>
        </div>

        {/* Google Login Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <h2 className="text-black-500 font-bold text-lg mt-7 text-center">Sign In to Continue</h2>
            </DialogHeader>

            <div className="flex flex-col items-center mt-4">
              <img src="/logo.svg" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-black-500 font-bold text-lg mt-4">Sign In with Google</h2>
              <DialogDescription className="text-muted-foreground text-sm mt-2 text-center">
                Please sign in to your account using Google.
              </DialogDescription>

              <Button onClick={login} className="w-full mt-7">
                <FcGoogle className="mr-2" /> Sign In with Google
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;
