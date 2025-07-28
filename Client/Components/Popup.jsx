import React from 'react'
import '../src/style/popup.css'
function Popup({ msg }) {
    return (
        <div className='fixed top-0 flex w-full h-full justify-center items-start '>
            <div className='py-3 px-3  bg-yellow-400  border rounded-xl pop-animation'>
                <h1 className='flex justify-center gap-1 items-center'><p className='bold text-xl'>{msg.name}</p> {msg.action} the Room</h1>
            </div>
        </div>
    )
}

export default Popup