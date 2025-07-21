
function ButtonField({text ,func}) {
    return (
        <div>
            <button className="border px-3 py-1 rounded-lg bg-yellow-400 w-full" 
            onClick={func} >{text}</button>
        </div>
    )
}

export default ButtonField