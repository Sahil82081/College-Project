import { useNavigate } from 'react-router-dom';
import { ButtonField } from '../Components';

function Home() {
    const navigate = useNavigate();
    return (

        <div className='h-screen w-screen flex justify-center items-center bg-black '>
            <div className='flex flex-col gap-4'>
                <ButtonField text={'Create Room'} func={()=>{navigate("/action/create")}}/>
                <ButtonField text={'Join Room'} func={()=>{navigate("/action/join")}}/>
            </div>
        </div>
    )
}

export default Home