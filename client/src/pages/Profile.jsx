import { useRef , useState , useEffect } from "react";
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.jsx';
import { useDispatch , useSelector } from 'react-redux';
import { updateUserStart , updateUserSuccess , updateUserFailure, 
          signoutUserStart , signoutUserSuccess , signoutUserFailure,
          deleteUserStart, deleteUserSuccess , deleteUserFailure
        } from '../redux/user/userSlice';
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {

  const {currentUser,loading,error} = useSelector( (state) => state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [uploadFileError,setUploadFileError] = useState(false);
  const [formData,setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [showListingsMessage,setShowListingsMessage] = useState();
  const [userListings,setUserListings] = useState([]);
  const [listingDelete,setListingDelete] = useState(null);
 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //console.log("FILE=",file);
  //console.log("Perc=",filePerc);
  //console.log("formData=",formData);

  /* firebase Storage rules:
  allow read; 
  allow write: if 
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*');
  */

  useEffect( () => {
      if (file) {
        handleFileUpload(file);
      }
  } , [file]);

  const handleFileUpload = (file) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name; // unique file name
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef , file);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        //console.log('Upload is '+progress+'% done');
        setFilePerc(Math.round(progress) );
      } ,

      (error) => {
        setUploadFileError(true);
        console.log(error);
      } ,

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            //console.log("downloadURL=",downloadURL);
            
            setFormData({ ...formData , avatar: downloadURL});
            //console.log("formData=",formData);
          });
      });
  };

  const handleChange = (e) => {
      setFormData({ ...formData , [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    setUpdateSuccess(false);
    const res = await fetch(`/api/user/update/${currentUser._id}`  , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
    //console.log(data);
    //navigate('/');
  };

  const handleSignout = async (e) => {
    //console.log("sono in handleSignout");
    e.preventDefault();
    //console.log("faccio dispatch");
    dispatch(signoutUserStart());
    //console.log("faccio fetch");
    const res = await fetch('/api/auth/signout');
    //console.log("fatta fetch");
    const data = await res.json();
    if(data.success === false) {
      dispatch(signoutUserFailure(data.message));
      return;
    }
    
    dispatch(signoutUserSuccess(null));

  };

  // DELETE the current user
  const handleDelete = async (e) => {
    e.preventDefault();

    // IF the user has LISTINGS , delete is FORBIDDEN
    try {
      const dataListings = await fetch(`/api/user/listings/${currentUser._id}`,{
        method: 'GET',
      });
      const listings = await dataListings.json();
      if (listings.length > 0) {
        alert(`You have ${listings.length} listings present !\nDelete account is forbidden !`);
        return;
      }
    } catch (error) {
      console.log(error.message);
    }

    const response = confirm(`Are you shure to delete ${currentUser.username} user ?`);
    if (!response)
      return;

    dispatch(deleteUserStart());
    
    const res = await fetch(`/api/user/delete/${currentUser._id}`  , {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      
    });
    const data = await res.json();
    if(data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    alert("user successfully deletede");
    dispatch(deleteUserSuccess(null));
    
  };

  const handleShowListings = async (e) => {
    e.preventDefault();
    setShowListingsMessage(null);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`  , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });
      const data = await res.json();
      if(data.success === false) {
        setShowListingsMessage(data.message);
        //console.log(data.message);
        return;
      }
      if(data.length === 0){
        setShowListingsMessage("You have not listings to show");
        return;
      }
      //console.log(data);
      setUserListings(data);

    } catch (error) {
      //console.log(error);
      setShowListingsMessage(error);
    }
  }

  const handleListingDelete = async (listingId) => {
    //e.preventDefault();
    setListingDelete(null);
    //console.log("listingId=",listingId);
    try {
      const res = await fetch(`/api/listing/delete/${listingId}` , {
        method: 'delete',
      });
      const data = await res.json();
      //console.log("data=.imageUrls",data.imageUrls);
      if(data.success === false) {
        setListingDelete(data.message);
        return;
         }
      // Now delete images of the listing from Firebase
      const storage = getStorage(app);
      for (let i = 0 ; i < data.imageUrls.length ; i++) {
        //console.log("index=",i," imageUrl=",data.imageUrls[i],"-------");
        const imageRef = ref( storage , data.imageUrls[i]);
        deleteObject(imageRef).catch( (err) => {
          console.log("Error deleting image : ",err);
        });
      }
      setUserListings( (oldList) => 
          oldList.filter( (listing) => listing._id !== listingId)
          );
      
    
    } catch (error) {
      console.log(error.message);
      setListingDelete(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input 
          onChange={(e) => setFile(e.target.files[0])}
          type="file" 
          ref={fileRef} hidden accept="image/*"/>
        <img  onClick={() => fileRef.current.click()}
              className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
              src={formData.avatar || currentUser.avatar} 
              referrerPolicy="no-referrer"
              alt='profile' />
        <p className="text-sm self-center">
          { uploadFileError ? (
            <span className="text-red-700">Image Uplod Error</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image uploaded</span>
          ) : (
            ""
          )
          }
        </p>

        <input id="username" 
            className="border p-3 rounded-lg" 
            placeholder="username" 
            type="text" 
            defaultValue={currentUser.username} 
            onChange={handleChange}
            required
        />
        <input id="email" 
            className="border p-3 rounded-lg" 
            placeholder="email" 
            type="email" 
            defaultValue={currentUser.email} 
            onChange={handleChange}
            required
        />
        <input id="password" 
                className="border p-3 rounded-lg" 
                placeholder="password" 
                type="password" 
                onChange={handleChange}
        />
        <button 
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 "
          disabled={loading}
          >
          {loading ? "loading...." : "update"}
        </button>
        <Link to={'/create-listing'}
              className="bg-green-700 text-white text-center rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 ">
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span  onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      {updateSuccess ? (<p className='text-green-700 mt-5'>{'User updated'}</p>
      ):(
        <p></p>
      )}
      <button className="text-green-700 w-full" 
          type="button"
          onClick={handleShowListings}>
        Show Listings
      </button>
      <p className="text-red-700 mt-5 w-full text-center">{showListingsMessage}</p>


      {userListings.length > 0 && 
      
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {listingDelete && <p className="text-red-700">{listingDelete}</p>}
          {userListings.map( (listing) => (
            
            <div key={listing._id} 
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing image" 
                      className="w-16 h-16 object-contain rounded-lg"
                />
              </Link>
              <Link to={`/listing/${listing._id}`} 
                    className="font-semibold text-slate-700 flex-1 hover:underline truncate">
                <p >{listing.name}</p>
              </Link>
              <div className="flex flex-col">
                <button className="text-red-700 uppercase"
                        onClick={() => handleListingDelete(listing._id)}
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">
                  Edit
                </button>
                </Link>
                
                
              </div>
            </div>
            
            )
          
          )}
        </div>
      }
    </div>
  )
}
