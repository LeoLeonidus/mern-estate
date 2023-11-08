import React from 'react'

export default function Listing() {
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
                    <span className='font-normal text-gray-400 mx-2'>The first image will be the cover</span>
                </p>
                <div className='flex gap-4'>
                    <input type='file' id='images' accept='image/*' multiple
                        className='p-3 border border-gray-300 rounded w-full'
                    />
                    <button className='p-3 text-green-700 text-center border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                    >
                        UPLOAD
                    </button>
                </div>
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase over:opacity-95 diasabled:opacity-80'>
                Create Listing
            </button>
            </div>
           
        </form>
    </main>
  )
}
