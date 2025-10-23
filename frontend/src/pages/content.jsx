import React from 'react';
import Banner from '../components/Banner';
import { useGetBooksQuery } from '../redux/api/bookApi';

const content = () => {

    const { data: books, isLoading, error } = useGetBooksQuery();

    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error fetching books</p>
    }

  return (
    <>
        <div className='w-full h-10 bg-indigo-100 flex justify-center items-center flex-row gap-2'>
            <p className='text-[12px] font-extralight'>if you don't have an account </p>
            <button className='text-[14px] font-extralight underline text-indigo-600 cursor-pointer'>
                login / signup
            </button>
        </div>
        <div className='shadow-xl'>
            <Banner/>
        </div>

        <div className='w-full bg-indigo-100 flex flex-col pt-18 justify-center items-center'>
            <p className='text-5xl font-bold'>See your favourite books here</p>
            <div className='w-full min-h-screen flex flex-wrap justify-center items-center'>
                {books?.map((book) => (
                     <div className='w-100 h-120 bg-white rounded-3xl shadow-xl hover:scale-102 transition-transform duration-300 flex flex-col items-center'>
                        <img 
                            src={book.coverImage}
                            className=''
                        />
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default content