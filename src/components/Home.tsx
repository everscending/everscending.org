import Layout from "./Layout";
import BlogSection from "./BlogSection";
import digitalLotusMobileLogo from "../assets/Everscending_Digital_Lotus_Logo.png";
import digitalLotusDesktopLogo from "../assets/Everscending_Digital_Lotus_Logo2.png";
import "./Home.css";

const Home = () => {
    return (
        <Layout id="home">
            <img
                className="home-logo mobile-logo"
                src={digitalLotusMobileLogo}
                alt="Digital Lotus"
            />

            <img
                className="home-logo desktop-logo"
                src={digitalLotusDesktopLogo}
                alt="Digital Lotus"
            />

            <BlogSection />
        </Layout>
    );
};

export default Home;
