import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { Cover } from "@/components/ui/cover";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button2} from "../ui/moving-border";
 

function Hero() {
  return (
    <BackgroundBeamsWithCollision>
    <div className='flex flex-col  items-center mx-56 gap-9'>
       <h1 className=' font-extrabold text-[50px] text-center mt-16 '>
       <Cover> <span className='text-red-500'>Discover Your Next Adventure with AI:</span>
        Personalized Itineraries at your Fingertips</Cover> 
        </h1>
        <p className='text-2xl font-bold text-gray-500 text-center '>Your personal trip planner and travel curator,creating custom itneraries tailored to your interests and budget</p>
        <Link to={"/create-trip"}>
        
       
        <Button2
        borderRadius="1.75rem"
        className="bg-black dark:bg-slate-900 text-white dark:text-white border-neutral-200 dark:border-slate-800"
      >
        <span>Get Started ! It's Free</span>
      </Button2>
       
         
        </Link>
    </div>
    </BackgroundBeamsWithCollision>
  )
}

export default Hero