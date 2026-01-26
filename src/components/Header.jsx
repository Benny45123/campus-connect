import CampusConnectLogo from "../assets/CampusConnectLogo.png";
const Header = () => {
    return (
        <header className="header flex  p-4  border-b-1 w-full h-25 top-0">
            <div className="flex -translate-y-38 translate-x-20">
            <img src={CampusConnectLogo} alt="Campus Connect Logo" className="logo h-50 w-50 " />
            </div>
            <div className="flex text-center right-30 space-x-7 absolute top-6">
                <button className="cursor-pointer">Sign in</button>
                <button className="text-white bg-black  p-3 pl-5 pr-5 rounded-3xl cursor-pointer">Get Started</button>
            </div>
        </header>
    );
}
export default Header;