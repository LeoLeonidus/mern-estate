import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Search() {

  const [sidebardata,setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    offer: false,
    parking: false,
    furnished: false,
    sort: 'createdAt',
    order: 'desc'
  });

  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [listings,setListings] = useState([]);

  useEffect( () => {
    //console.log("sono in useeffect");
    const  urlParams = new URLSearchParams(document.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    //console.log("typeFromUrl=",typeFromUrl);
    const parkingFromUrl = urlParams.get('parking');
    //console.log("parkingFromUrl=",parkingFromUrl);
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl =  urlParams.get('order');
    if (searchTermFromUrl||
        typeFromUrl||
        parkingFromUrl||
        furnishedFromUrl||
        offerFromUrl||
        sortFromUrl||
        orderFromUrl) {
          setSidebardata({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'createdAt',
            order: orderFromUrl || 'desc'
          });
        }

        const fetchListings = async () => {
            try {
              setLoading(true) ;
              const searchQuery = urlParams.toString();
              const res = await fetch(`/api/listing/get?${searchQuery}`, {method: 'GET'});
              const data = await res.json();
              
              if (data.success === false){
                console.log(data.message);
                setLoading(false);
                return;
              }
              setListings(data);
              setLoading(false);
              console.log(listings);
            } catch (error) {
              console.log(error.message);
              setLoading(false);
            }
        };

        fetchListings();

  }, [document.location.search]) ;

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebardata({
        ...sidebardata,
        type: e.target.id
      });
    }
    if (e.target.id === 'searchTerm') {
      setSidebardata({
        ...sidebardata,
        searchTerm: e.target.value
      });
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false
      });
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({
        ...sidebardata,
        sort,
        order
      });
    }
    
  };

  //console.log(sidebardata);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm',sidebardata.searchTerm);
    urlParams.set('type',sidebardata.type);
    urlParams.set('parking',sidebardata.parking);
    urlParams.set('furnished',sidebardata.furnished);
    urlParams.set('offer',sidebardata.offer);
    urlParams.set('sort',sidebardata.sort);
    urlParams.set('order',sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className='flex flex-col md:flex-row'>

      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form 
          onSubmit={handleSubmit}
          className='flex flex-col gap-8'
        >
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search term:</label>
            <input 
              type='text'
              id='searchTerm'
              placeholder='Search ....'
              className='boder rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='all'
                className='w-5'
                checked={sidebardata.type === 'all'}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='rent'
                className='w-5'
                checked={sidebardata.type === 'rent'}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='sale'
                className='w-5'
                checked={sidebardata.type === 'sale'}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='offer'
                className='w-5'
                checked={sidebardata.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='parking'
                className='w-5'
                checked={sidebardata.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox'
                id='furnished'
                className='w-5'
                checked={sidebardata.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>

          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select 
              id='sort_order' 
              className='border rounded-lg p-3'
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
            >
              <option value={'regularPrice_desc'}>Price high to low</option>
              <option value={'regularPrice_asc'}>Price low to high</option>
              <option value={'createdAt_desc'}>Latest</option>
              <option value={'createdAt_asc'}>Oldest</option>
            </select>
          </div>
          <button className='uppercase bg-slate-800 text-white p-3 rounded-lg hover:opacity-95'>
            Search
          </button>
        </form>
      </div>

      <div>
        <h1 className='text-3xl font-semibold border-b p-3 mt-5 text-slate-700'>
          Search Results
        </h1>
      </div>
      
    </div>

    
  )
}
