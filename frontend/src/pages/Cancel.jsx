import React from 'react'

const Cancel = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <h1 className="text-3xl font-bold text-red-700">Payment Cancelled ❌</h1>
      <p className="mt-2 text-lg text-gray-700">Your payment was not completed. Try again later.</p>
    </div>
  )
}

export default Cancel