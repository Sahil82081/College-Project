import { useParams } from 'react-router-dom'
import { InputField, ButtonField } from '../Components'
import { usestate } from '../Provider/StateContext'
import { useSocket } from '../Provider/SocketContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../Components'

function Create_Join() {
    const { type } = useParams()
    const { data, setData, loading, setLoading ,setIsUserConnect} = usestate()
    const socket = useSocket()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = () => {
        setLoading(true)
        socket.emit('createroom', data)
        console.log("Form submitted with data:", data);
    }

    const handleJoinRoom = () => {
        if (data.roomId == "") {
            console.error("Room name and ID are required to join a room.");
            return;
        }
        setLoading(true);
        socket.emit('joinroom', data);
    }

    useEffect(() => {
        if (!socket) return;

        const handleRoomCreated = ({ room, roomId, userid, name }) => {
            setLoading(false);
            setIsUserConnect(true)
            console.log(`Successfully joined room: ${room} with ID: ${roomId}`);
            navigate(`/room/${name}/${room}/${roomId}`);
        };

        const handleroomnotfound = ({ msg }) => {
            alert(msg);
            setLoading(false);
        }

        const handleroomjoined = ({ room, roomId, userid, name }) => {
            setLoading(false);
            setIsUserConnect(true)
            console.log(`Successfully joined room: ${room} with ID: ${roomId}`);
            navigate(`/room/${name}/${room}/${roomId}`);
        };

        socket.on('roomcreated', handleRoomCreated);
        socket.on('roomjoined', handleroomjoined);
        socket.on('roomnotfound', handleroomnotfound)

        return () => {
            socket.off('roomJcreated', handleRoomCreated);
            socket.off('roomjoined', handleroomjoined);
            socket.off('roomnotfound', handleroomnotfound)
        };
    }, [socket]);

    return (
        <div className='h-screen w-screen flex justify-center items-center bg-black'>
            <div className='flex flex-col gap-4 '>
                {type === 'create' ?
                    (<>
                        <InputField placeholder={"Your Name"} value={data.name} name={'name'} func={handleChange} />
                        <InputField placeholder={"Room Name"} value={data.room} name={'room'} func={handleChange} />
                        <InputField placeholder={"Room Password"} value={data.roomid} name={'roomId'} func={handleChange} />
                        <ButtonField text={"Submit"} func={handleSubmit} />
                    </>
                    ) :
                    (<>
                        <InputField placeholder={"Your Name"} func={handleChange} name={'name'} />
                        <InputField placeholder={"Room Password"} func={handleChange} name={'roomId'} />
                        <ButtonField text={"Submit"} func={handleJoinRoom} />
                    </>
                    )}
            </div>
            {loading ? <Loader /> : ""}
        </div>
    )
}

export default Create_Join