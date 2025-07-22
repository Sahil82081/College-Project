
import { useParams } from 'react-router-dom';
import { Chat, ButtonField, InputField } from '../Components'
import { useSocket } from '../Provider/SocketContext'
import { useEffect, useRef, useState } from 'react';
function Chat_Container() {
    const { room, roomid } = useParams();
    const [msg, setMsg] = useState("");
    const [chats, setChats] = useState([]);
    const [image, setImage] = useState(null);
    const socket = useSocket();
    const chatref = useRef(null);

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
            console.log("hello")
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


    useEffect(() => {
        if (!socket) return;

        const handleReceivedMsg = ({ msg, image }) => {
            console.log("Received message");
            setChats((prev) => [...prev, { msg, image, sender: 'Other' }]);
        }

        socket.on('recivedmsg', handleReceivedMsg);

        return () => {
            socket.off('recivedmsg', handleReceivedMsg);
        };
    }, [socket])


    useEffect(() => {
        chatref.current.scrollTop = chatref.current.scrollHeight;
    }, [chats])

    return (
        <div className='h-screen w-screen flex flex-col   gap-3  bg-black p-4'>
            <span className='w-full flex justify-end '><ButtonField text={"Leave"} /></span>
            <hr className='w-full border border-gray-400' />
            <span className='text-gray-200 text-center'>You Joined the {room} Room </span>
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
                />
                <input type="file"
                    accept='images/*'
                    id="image"
                    className='hidden'
                    name="image"
                    onChange={(e) => { setImage(e.target.files[0]) }} />

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
        </div>
    )
}

export default Chat_Container