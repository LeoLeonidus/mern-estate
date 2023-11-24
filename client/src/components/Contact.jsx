import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Contact({listing}) {
    console.log("CONTACT listing=",listing);

    const [landlord,setLandlord] = useState(null);
    const [message,setMessage] = useState('');

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }

    useEffect( () => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}` , {
                    method: 'GET',
                });
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                setLandlord(data);

            } catch (error) {
                console.log(error.message);
            }
        };
        fetchLandlord();
    },[listing.userRef]);

  return (
    <>
        Contact
    {landlord && (
        <div className='flex flex-col gap-2'>
            <p>Contact 
                <span className='font-bold'> {landlord.username} </span> 
                for 
                <span className='font-bold'> {listing.name.toLowerCase()}</span>
            </p> 
            <textarea 
                name='message' 
                id='message' 
                rows={2} 
                value={message} 
                onChange={handleMessage}
                placeholder='Enter your message .....'
                className='w-full border border-gray-600 p-3 rounded-lg'>
            </textarea>
            <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
                Send Message
            </Link>
        </div>
        
    )}
    </>
  )
}

Contact.propTypes = {
    listing: PropTypes.object.isRequired,
}
