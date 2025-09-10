import Navbar from "./Navbar";

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Navbar />
            <div className="py-12 px-4">
                <div className="lg:max-w-[1440px] md:max-w-[744px] max-w-[375px] w-full py-10 lg:px-10 md:px-6 px-4 bg-white mx-auto">
                    {children}
                </div>
            </div>
        </>
    );
}

export default Layout;

    