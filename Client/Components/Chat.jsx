

function Chat({ sender, msg, image }) {
    console.log("Sent message:", msg, image);
    return (
        <div className={`flex flex-col  gap-2 py-1 px-3 ${sender === 'You' ? 'items-end' : 'items-start'}`}>
            {image && <div className=' border rounded-xl max-w-[50%]'>
                <img src={image} />
            </div>}
            {msg && <div className='p-2 bg-yellow-300 border rounded-xl max-w-[50%]' >
                <p style={{ wordWrap: 'break-word' }} className='text-lg whitespace-pre-wrap'>{msg}</p>
            </div>}

        </div>
    )
}

export default Chat