import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable ,deleteObject} from "firebase/storage";
import { app } from "../firebase";


export default function Listing() {

    const [files , setFiles] = useState([]);
    //console.log("Files:",files);

    const [formData , setFormData] = useState({
        imageUrls: [],

    })
    //console.log("formData=",formData);

    const [imageUploadError , setImageUploadError] = useState(false);
    const [imageRemoveError , setImageRemoveError] = useState(false);

    const [uploading , setUploading] = useState(false);

    const handleImageSubmit = (e) => {
        setImageUploadError(false);
        setImageRemoveError(false);
        console.log("Faccio setUploading true");
        setUploading(true);
        if ( files.length > 0 && (files.length + formData.imageUrls.length)< 7) {
            const promises = [];
            for (let i=0; i<files.length; i++) {
                promises.push(storeImage(files[i]));
            };
            Promise.all(promises).then( (urls) => {
                setFormData({ ...formData , imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                console.log("Faccio setUploading false");
                setUploading(false);
            }).catch( (err) => {
                setImageUploadError('Image Upload failed (2 mb max per image)');
                
            }); 
        } else {
            setImageUploadError('Only 6 images per listing');
            setUploading(false);
        };
        
    };
    const storeImage = async (file) => {
        return new Promise( (resolve,reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage , fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                    console.log(`Upload is ${Math.round(progress)}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then( (downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setImageRemoveError(false);
        const storage = getStorage(app);
        const imageRef = ref(storage, formData.imageUrls[index]);
        deleteObject(imageRef).then( () => {
            setFormData({
                ...formData,
                imageUrls: formData.imageUrls.filter (( _ , i) => i !== index )
            })
        }).catch( (err) => {
            console.log("Error deteObject : " , err);
            setImageRemoveError("Remove Image Failed");
        })

    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Create Listing
        </h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' 
                    id='name'
                    className='border p-3 rounded-lg' 
                    maxLength={62}
                    minLength={10}
                    required
                />
                <textarea type='text' placeholder='Description' 
                    id='description'
                    className='border p-3 rounded-lg' 
                    required
                />
                <input type='text' placeholder='Address' 
                    id='address'
                    className='border p-3 rounded-lg' 
                    required
                />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='sale'
                            className='w-5'
                        />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='rent'
                            className='w-5'
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='parking'
                            className='w-5'
                        />
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='furnished'
                            className='w-5'
                        />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='offer'
                            className='w-5'
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min={1} max={10} required
                            className='p-3 border border-gray-300 rounded-lg'
                        />
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min={1} max={10} required
                            className='p-3 border border-gray-300 rounded-lg'
                        />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' 
                            className='p-3 border border-gray-300 rounded-lg'
                        />
                        <div className='flex flex-col text-center'>
                            <p>Regular Price</p>
                            <span className='text-sm'>( $ / month )</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='discountPrice' 
                            className='p-3 border border-gray-300 rounded-lg'
                        />
                        <div className='flex flex-col text-center'>
                            <p>Discount Price</p>
                            <span className='text-sm'>( $ / month )</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4 flex-1'>
                <p className='font-semibold'>
                    Images :
                    <span className='font-normal text-gray-400 mx-2'>The first image will be the cover ( max 6 )</span>
                </p>
                <div className='flex gap-4'>
                    <input type='file' 
                        id='images' 
                        accept='image/*' 
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                        className='p-3 border border-gray-300 rounded w-full'
                    />
                    <button 
                        onClick={handleImageSubmit}
                        type="button"
                        disabled={uploading}
                        className='p-3 text-green-700 text-center border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                    >
                        { uploading ? 'Uploading ...' : 'Upload'}
                    </button>
                </div>
                <p className="text-red-700">{imageUploadError && imageUploadError}</p>
                <p className="text-red-700">{imageRemoveError && imageRemoveError}</p>
                
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map( (url , index) => {
                        return (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="image list" className="w-20 h-20 object-cover rounded-lg"/>
                               
                                <button type="button" 
                                        onClick={() => handleRemoveImage(index)}
                                        className=" p-3 text-red-700 rounded-lg uppercase hover:opacity-75">
                                    Delete
                                </button>
                                
                            </div>
                        )
                       
                        
                    })
                }
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase over:opacity-95 diasabled:opacity-80'>
                Create Listing
                </button>
            </div>
           
        </form>
    </main>
  )
}
