import { useSelector } from "react-redux";
import { useRef , useState , useEffect } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.jsx';

export default function Profile() {

  const {currentUser} = useSelector( (state) => state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [uploadFileError,setUploadFileError] = useState(false);
  const [formData,setFormData] = useState({});

  //console.log("FILE=",file);
  //console.log("Perc=",filePerc);

  /* firebase Storage rules:
  allow read; 
  allow write: if 
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('images/.*');
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
            console.log("downloadURL=",downloadURL);
            
            setFormData({ ...formData , avatar: downloadURL});
            console.log("formData=",formData);
          });
      });
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
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
            /* value={currentUser.username} *//>
        <input id="email" 
            className="border p-3 rounded-lg" 
            placeholder="email" 
            type="email" 
           /*  value={currentUser.email} *//>
        <input id="password" className="border p-3 rounded-lg" placeholder="password" type="password" />
        <button 
          type="button"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 ">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  )
}
