
import { useParams, useNavigate } from 'react-router-dom';
import { Chat, ButtonField, Loader, Popup, OnlineUsers } from '../Components'
import { useSocket } from '../Provider/SocketContext'
import { usestate } from '../Provider/StateContext'
import { useEffect, useRef, useState } from 'react';
function Chat_Container() {
    const { room, roomid, name } = useParams();
    const [msg, setMsg] = useState("");
    const [chats, setChats] = useState([]);
    const navigate = useNavigate()
    const [image, setImage] = useState(null);
    const socket = useSocket();
    const chatref = useRef(null);
    const { loading, setLoading, setIsPopup, isuserconnect, setIsUserConnect } = usestate()
    const [newuser, setNewUser] = useState(null)
    const [connectedUser, setConnectedUser] = useState(null)
    const [isonline, setIsOnline] = useState(false)

    const handleimage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result); // base64 string
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    };

    const handleSendMsg = async () => {
        if (msg.trim() === "" && !image) {
            return;
        };

        let base64 = "";
        const maxSize = 200 * 1024; // 100KB in bytes

        if (image) {
            try {
                if (image.size > maxSize) {
                    alert("Image size exceeds 200KB!");
                    setImage(null);
                    return;
                }
                base64 = await handleimage(image);
            } catch (error) {
                console.error("Image processing failed", error);
                return;
            }
        }

        socket.emit('sendmsg', { room, roomid, msg, image: base64 });
        console.log("Message sent");
        setChats((prev) => [...prev, { msg, image: base64, sender: 'You' }]);
        setMsg("");
        setImage(null);
    }

    const handleLeaveRoom = () => {
        socket.emit("userLeave")
        navigate('/')
    }
    useEffect(() => {
        if (!socket) return;

        const handleReceivedMsg = ({ msg, image }) => {
            console.log("Received message");
            setChats((prev) => [...prev, { msg, image, sender: 'Other' }]);
        }

        const handleleftUsers = (name) => {
            setNewUser({ name, action: "left" })
            console.log({ name, action: "left" })
            setIsPopup(true)
            setTimeout(() => {
                setIsPopup(false)
                setNewUser(null)
            }, 3000)
        }
        const handleNewUser = (name) => {
            setNewUser({ name, action: "join" })
            console.log({ name, action: "join" })
            setIsPopup(true)
            setTimeout(() => {
                setIsPopup(false)
                setNewUser(null)
            }, 3000)
        }
        const handleConnectedUser = (data) => {
            setConnectedUser(data)
        }

        socket.on('recivedmsg', handleReceivedMsg);
        socket.on('userleft', handleleftUsers);
        socket.on('connectedUser', handleConnectedUser);
        socket.on('newUser', handleNewUser);

        return () => {
            socket.off('recivedmsg', handleReceivedMsg);
            socket.off('userleft', handleleftUsers);
            socket.off('connectedUser', handleConnectedUser);
            socket.off('newUser', handleNewUser);
        };
    }, [socket])

    useEffect(() => {
        if (!socket) return;
        if (!isuserconnect && room && roomid && name) {
            socket.emit('joinroom', {
                room,
                roomId: roomid,
                name
            })
            setLoading(true)
        }
        const handleroomjoined = () => {
            setIsUserConnect(true)
            setLoading(false)
        }
        const handleroomnotfound = () => {
            setLoading(false)
            navigate("/")
        }
        socket.on('roomjoined', handleroomjoined);
        socket.on('roomnotfound', handleroomnotfound)
        return () => {
            socket.off('roomjoined', handleroomjoined);
            socket.off('roomnotfound', handleroomnotfound)
        }
    }, [isuserconnect, room, roomid, name, socket])
    useEffect(() => {
        chatref.current.scrollTop = chatref.current.scrollHeight;
    }, [chats])
    return (
        <div className='h-screen w-screen flex flex-col   gap-3  bg-black p-4'>
            <span className='w-full flex justify-end gap-4'>
                {connectedUser ?
                    <span className='border px-3 py-1 rounded-lg bg-yellow-400 ' onClick={() => { setIsOnline(true) }}>{connectedUser.length} Online</span>
                    : ""}
                <ButtonField text={"Leave"} func={handleLeaveRoom} />
            </span>
            <hr className='w-full border border-gray-400' />
            <span className='text-gray-300 text-center flex justify-center gap-1 items-center'>You Joined the <p className='text-xl font-semibold text-white'>{room} </p> Room </span>
            <div className='flex-1 overflow-auto gap-2' ref={chatref}>
                {chats.map((chat, index) => (
                    <Chat key={index} msg={chat.msg} image={chat.image} sender={chat.sender} />
                ))}
            </div>
            <span className='w-full flex gap-3'>
                <textarea
                    name="msg"
                    placeholder="Message"
                    className="px-3 py-1 border rounded-lg flex-1 resize-none h-8"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMsg()
                        }
                    }}
                />
                <input type="file"
                    accept='images/*'
                    id="image"
                    className='hidden'
                    name="image"
                    onChange={(e) => { setImage(e.target.files[0]) }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMsg()
                        }
                    }} />

                {image ?
                    (<>
                        <ButtonField text={"Clean"} func={() => { setImage(null) }} />
                        <p className='text-white'>{image.name}</p>
                    </>) :
                    (<label htmlFor="image" className="border px-3 rounded-lg bg-yellow-400 " >
                        Image
                    </label>)}

                <ButtonField text={"Send"} func={handleSendMsg} />
            </span>
            {loading ? <Loader /> : ""}
            {newuser && <Popup msg={newuser} />}
            {isonline && <OnlineUsers user={connectedUser} func={() => { setIsOnline(false) }} />}
        </div>
    )
}

export default Chat_Container