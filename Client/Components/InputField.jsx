import React from 'react'

function InputField({ placeholder, value, name, func }) {
    return (
        <div>
            <input type="text"
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={func}
                className='bg-yellow-200 px-2 py-1 border border-white rounded-lg' />
        </div>
    )
}

export default InputField