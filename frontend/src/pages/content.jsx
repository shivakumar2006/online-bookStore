import React from 'react';
import Banner from '../components/Banner';
import { useGetBooksQuery, useGetBookByIdQuery } from '../redux/api/bookApi';

const content = () => {

    const { data: books, isLoading, error } = useGetBooksQuery();
    const { data: bookss } = useGetBookByIdQuery();

    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error fetching books</p>
    }
    
    console.log("images data : ", books);
    console.log("single data : ", bookss);
    console.log("Error fetching data: ", error);

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
            <div className='w-full min-h-screen flex flex-wrap justify-center items-center gap-10 mt-5'>
                {books?.map((book, index) => (
                     <div key={index} className='w-100 h-150 bg-white rounded-3xl shadow-xl hover:scale-102 transition-transform duration-300 flex flex-col items-center'>
                        <img 
                            src={`http://localhost:8080/books/images/${book.coverImage}`}
                            className='w-90 h-90 object-cover rounded-t-2xl mt-5'
                        />
                        <div className='w-100 px-5 mt-5 flex flex-col'>
                            <p className='font-bold text-3xl'>{book.title}</p>
                            <p className='font-extralight text-2xl mt-5'>₹{book.price}/-</p>
                            <p className='font-extralight text-xl mt-5'><span className='font-light'>In stock:</span> {book.stock} <span className='text-sm'>units</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default content