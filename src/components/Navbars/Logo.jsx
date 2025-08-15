
const Logo = ({ onClick }) => {

  return (
    <div className="flex items-center justify-center space-x-3 cursor-pointer group" onClick={onClick}>
       <img src="https://graphicsauce.co/free-placeholder-logo/wp-content/uploads/2024/08/Free-PlaceHolder-Logo.jpg" alt="Logo" className="w-10 h-10 object-contain transition-transform group-hover:scale-105" />
            
      <span className="font-bold text-xl text-gray-900 sm:block">Carter</span>
    </div>
  );
};

export default Logo; 