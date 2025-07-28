import { useNavigate } from 'react-router-dom';
import { ButtonField, Loader } from '../Components';
import { usestate } from '../Provider/StateContext'

function Home() {
    const navigate = useNavigate();
    const { loading, setLoading } = usestate()
    return (

        <div className='h-screen w-screen flex justify-center items-center bg-black '>
            <div className='flex flex-col gap-4'>
                <ButtonField text={'Create Room'} func={() => { navigate("/action/create") }} />
                <ButtonField text={'Join Room'} func={() => { navigate("/action/join") }} />
            </div>
            {loading ? <Loader /> : ""}
        </div>
    )
}

export default Home