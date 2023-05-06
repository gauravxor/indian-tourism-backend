import profile1 from '../../UI/Images/gaurav1.jpg';
import profile2 from '../../UI/Images/kaushal.jpg';
import profile3 from '../../UI/Images/rohit.jpg';
import profile4 from '../../UI/Images/sumit-1.jpg';
import './About.css';

const About = ()=>{
    return(
        <div className="main-box">
            <div className="profile">
                <img className='g-img' src={profile1} alt="profile1" />
                <div className="details">
                  <h2>Gaurav Aggarwal</h2>
                </div>
            </div>
            <div className="profile">
                <img src={profile2} alt="profile2" />
                <div className="details">
                  <h2>Kaushal Pandit</h2>
                </div>
            </div>
            <div className="profile">
                <img src={profile3} alt="profile3" />
                <div className="details">
                  <h2>Rohit Kumar</h2>
                </div>
            </div>
            <div className="profile">
                <img src={profile4} alt="profile4" />
                <div className="details">
                  <h2>Sumit Kumar Shaw</h2>
                </div>
            </div>
        </div>
    );
};
export default About;