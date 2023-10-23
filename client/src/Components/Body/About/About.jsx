import gaurav from "../../../assets/images/gaurav.jpg";
import kaushal from "../../../assets/images/kaushal.jpg";
import rohit from "../../../assets/images/rohit.jpg";
import "./About.css";

const profiles = [
    { name: "Gaurav Aggarwal", src: gaurav },
    { name: "Kaushal Pandit", src: kaushal },
    { name: "Rohit Kumar", src: rohit },
];

const Profile = ({name, imageSrc}) => {
    return (
        <div className="profile">
            <img src={imageSrc} alt={`${name}'s image`} />
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
