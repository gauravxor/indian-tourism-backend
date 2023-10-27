import "./About.css";
import imageUrls from "../../../fileUrls";
const profiles = [
    { name: "Gaurav Aggarwal", src: imageUrls.gaurav },
    { name: "Kaushal Pandit", src: imageUrls.kaushal },
    { name: "Rohit Kumar", src: imageUrls.rohit },
];

const Profile = ({ name, imageSrc }) => {
    return (
        <div className="profile">
            <img src={imageSrc} alt={`${name}'s profile img`} />
            <div className="details">
                <h2>{name}</h2>
            </div>
        </div>
    );
};

const About = () => {
    return (
        <div className="main-box">
            {profiles.map((profile) => {
                return <Profile name={profile.name} imageSrc={profile.src} />;
            })}
        </div>
    );
};

export default About;
