import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable ,deleteObject} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate , useParams} from "react-router-dom";


export default function ListingUpdate() {

    const {currentUser} = useSelector( (state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files , setFiles] = useState([]);
    //console.log("Files:",files);

    const [formData , setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    });
    //console.log("formData=",formData);

    useEffect( () => {

        const fetchListing = async () => {
            const listingId = params.listingId;
            //console.log("listingId=",listingId);
            try {
                //setError(false);
                //setLoading(true);
                const res = await fetch(`/api/listing/get/${listingId}`  , {
                    method: 'GET',
                    
                  });
                  const data = await res.json();
                  //setLoading(false);
                  if(data.success === false) {
                    //setError(data.message);
                    console.log("Error fetchListing=",data.message);
                    return;
                  }
                  setFormData(data);
            } catch (error) {
                console.log("Error fetchListing=",error.message);
                //setError(error.message);
                //setLoading(false);
            }
        };

        fetchListing();

    } , [] );

    const [imageUploadError , setImageUploadError] = useState(false);
    const [imageRemoveError , setImageRemoveError] = useState(false);

    const [uploading , setUploading] = useState(false);

    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(false);

    const handleImageSubmit = (e) => {
        if (files.length === 0) 
            return;
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
                setUploading(false);
            }); 
        } else {
            setImageUploadError('Only 6 images per listing');
            setUploading(false);
        }
        
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
            //setImageRemoveError("Remove Image Failed");
            setFormData({
                ...formData,
                imageUrls: formData.imageUrls.filter (( _ , i) => i !== index )
            });
        })

    };

    const handleChange = (e) => {
        // formData.type : values are SALE or RENT (input type is checkbox)
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.imageUrls.length < 1) {
            setError('No images uploaded ! , upload 1 image at least');
            return;
        }
        if (formData.discountPrice > formData.regularPrice) {
            setError('Discount price must be less then Regular price');
            return;
        }
        try {
            setError(false);
            setLoading(true);
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/update/${listingId}`  , {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
              });
              const data = await res.json();
              setLoading(false);
              if(data.success === false) {
                setError(data.message);
                return;
              }
              navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Update Listing
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' 
                    id='name'
                    className='border p-3 rounded-lg' 
                    maxLength={62}
                    minLength={10}
                    required
                    onChange={handleChange}
                    value={formData.name}
                />
                <textarea type='text' placeholder='Description' 
                    id='description'
                    className='border p-3 rounded-lg' 
                    required
                    onChange={handleChange}
                    value={formData.description}
                />
                <input type='text' placeholder='Address' 
                    id='address'
                    className='border p-3 rounded-lg' 
                    required
                    onChange={handleChange}
                    value={formData.address}
                />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='sale'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='rent'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='parking'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.parking}
                        />
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='furnished'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type='checkbox' id='offer'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min={1} max={10} required
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.bedrooms}
                        />
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min={1} max={10} required
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.bathrooms}
                        />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' 
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.regularPrice}
                            min={50}
                            max={1000000}
                        />
                        <div className='flex flex-col text-center'>
                            <p>Regular Price</p>
                            <span className='text-sm'>( $ / month )</span>
                        </div>
                    </div>
                    { formData.offer && 
                    <div className='flex items-center gap-2'>
                        <input type='number' id='discountPrice' 
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.discountPrice}
                            min={0}
                            max={1000000}
                        />
                        <div className='flex flex-col text-center'>
                            <p>Discount Price</p>
                            <span className='text-sm'>( $ / month )</span>
                        </div>
                    </div>
                    }
                    
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
                <button
                    disabled={ uploading || loading} 
                    className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-30'>
                {loading ? 'updating ....' : 'update listing'}
                </button>
                {error && <p className="text-red-900 text-sm">{error}</p>}
            </div>
           
        </form>
    </main>
  )
}
