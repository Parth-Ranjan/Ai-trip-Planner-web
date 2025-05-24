import React,{useState} from 'react'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
;


function Header() {
  
  const [dialogOpen, setDialogOpen] = useState(false);
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
        window.location.reload()
         // Retry after login
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
  const user=JSON.parse(localStorage.getItem('user'))
  return (
    <div className='flex justify-between items-center p-3 px-5 shadow-md'>
        <a href='/'><img src="/logo.svg" alt="logo" className='w-20 h-15' /></a>
        <div >{user?<div className='flex items-center gap-3'>
          <a href='/create-trip'>
          <Button variant="outline">+Create Trip</Button>
          </a>
          <a href='/my-trips'>
          <Button variant="outline">My Trips</Button>
          </a>
          <Popover>
             <PopoverTrigger><img src={user?.picture} alt="user" className='w-[35px] h-[35px] rounded-full ml-2' /></PopoverTrigger>
            <PopoverContent ><h2 className="cursor-pointer" onClick={()=>{
              googleLogout();
              localStorage.clear()
              window.location.reload()
            }}>Log Out</h2></PopoverContent>
         </Popover>

          
        </div>:
        <Button onClick={()=>setDialogOpen(true)}>Sign In</Button>}
        
        </div>
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
  )
}

export default Header