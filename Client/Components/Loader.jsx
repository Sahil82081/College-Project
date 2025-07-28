import '../src/style/loader.css'
function Loader() {
  return (
    <div className='absolute top-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-70'>
      <span className="loader"></span>
    </div>
  )
}

export default Loader