import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react';

export default function Header() {

    const {currentUser} = useSelector(state => state.user);

    const navigate = useNavigate();

    const [searchTerm , setSearchTerm] = useState('');

    useEffect( () => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[]);

    const handleSearch = (e) => {
        e.preventDefault();
        //console.log("search=",searchTerm);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

  return (
    <header className="bg-slate-200 shadow-md">
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to={'/'}>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>Leonidus</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
            </Link>
            <form 
                onSubmit={handleSearch}
                className='bg-slate-100 p-3 rounded-lg flex items-center'
            >
                <input type='text' 
                        placeholder='Search....' 
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                    <FaSearch className='text-slate-700'/>
                </button>
                
            </form>
            <ul className='flex gap-4'>
                <Link to={'/'}>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to={'/about'}>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to={currentUser ? '/profile' : '/sign-in'}>
                    { currentUser ? (
                        <img className='rounded-full h-7 w-7 object-cover' 
                            src={currentUser.avatar} 
                            alt='profile' 
                            referrerPolicy='no-referrer'/>
                    ) : (
                        <li className='text-slate-700 hover:underline'>Sign In</li>
                    )
                    }
                </Link>
            </ul>
        </div>
        
    </header>
  )
}
