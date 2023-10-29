import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const dispatch =useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {

        try {
           const provider = new GoogleAuthProvider(); 
           const auth = getAuth(app);

           const result = await signInWithPopup(auth,provider);
           console.log("result=",result.user);
           console.log("name=",result.user.displayName);
           console.log("email=",result.user.email);
           console.log("photo=",result.user.photoURL);
           const res = await fetch('/api/auth/google' , {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            }),
           });
           const data = await res.json();
           dispatch(signInSuccess(data));
           navigate('/');
        } catch (error) {
            console.log('Google sign in KO',error);
        }
    };

  return (
    <button 
        type='button'
        className='bg-red-700 text-white p-3 rounded-lg uppercase over:opacity-95'
        onClick={handleGoogleClick}
    >
        Continue with Google Account
    </button>
  )
}
