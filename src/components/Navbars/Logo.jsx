
const Logo = ({ onClick }) => {

  return (
    <div className="flex items-center justify-center space-x-3 cursor-pointer group" onClick={onClick}>
       <img src="https://trycarter.com/images/carter-logo.svg" />
            
      {/* <span className="font-bold text-xl text-gray-900 sm:block">Carter</span> */}
    </div>
  );
};

export default Logo; 