import profile from '../Image/account.png'
import cross from '../Image/cross.png'
function OnlineUsers({ user, func }) {
    return (
        <div className='fixed top-0 h-screen w-screen flex justify-center items-center bg-black bg-opacity-70'>
            <div className='flex flex-col bg-yellow-400  rounded-xl px-4 py-2 gap-5'>
                <div className='flex justify-end'>
                    <img src={cross} className='h-9' onClick={func} />
                </div>
                <div className='flex flex-col gap-2 h-60 w w-72 overflow-auto'>
                    {user.map((user, i) => (
                        <>
                            <span className='flex gap-5'>{i + 1}. <img src={profile} className='h-7' alt="" /> {user.name}</span>
                            <hr className='border-black' />
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OnlineUsers