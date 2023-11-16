
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Swiper , SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';


export default function Listing() {

    SwiperCore.use(Navigation);

    const [listing , setListing] = useState(null);
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(false);
    const params = useParams();
  

    useEffect( () => {       
            setLoading(true);
            setError(false);
            
            const fetchListing = async () => {
                console.log("SONO IN FETCHLISTING");
                try {
                    console.log("params.listingId=",params.listingId);
                    const res = await fetch(`/api/listing/get/${params.listingId}`, {
                    method: 'GET',
                    });
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    setLoading(false);
                    setError(true);
                    return;
                }
                
                setListing(data);
                setLoading(false);
                setError(false);
                
            } catch (error) {
                setError(true);
                setLoading(false);
              console.log(error.message);  
            }
        } ;

        fetchListing();
        
    },[params.listingId]);

   
  return (
    <main>
        <div>

        {loading && <p className='mt-5 text-center font-bold'>Loading ..</p>}
        {error && <p className='mt-5 text-center font-bold'>Error Loading !!</p>}       
        
        { listing && !loading && !error &&
                 //console.log("LISTING=",listing)
            <Swiper navigation> 
            {listing.imageUrls.map( (url) => (
                <SwiperSlide key={url}>
                    <div
                        className='h-[550px]'
                        style={{ background: `url(${url}) center no-repeat` , backgroundSize: 'cover'}}
                    >

                    </div>
                </SwiperSlide>
            )
                
                )}
            </Swiper>   
        } 
                    
        </div>
    </main>
  )
}
