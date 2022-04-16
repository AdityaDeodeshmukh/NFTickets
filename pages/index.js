//import user image
import Image from 'next/image'
import userImage from "./user.png";
// import "./App.css";
import Image1 from "./pic1.png";
import Image2 from "./pic2.png";
import Image3 from "./pic3.png";
import Image4 from "./pic4.png";
import nftImg from "./logo_final.png";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../styles/globals.css'

// function Image() {
//   return (
//     <div className="userImage">
//       <img src={userImage} alt="user" style={{ width: "2rem" }} />
//     </div>
//   );
// }

function NavBar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      
    >
      <a className="navbar-brand" href="/" style={{ marginLeft: "10px" }}>
        <h3>NFTickets</h3>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/create-ticket">
              Create
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/ticket-place">
              Buy Now
            </a>
          </li>
          <li className="nav-item" style={{ marginRight: "15px" }}>
            <a href="/my-tickets">
            <Image src={userImage} width={40} height={40}/>
            </a>
          </li>
        </ul>
      </div>
      <div className="line"></div>
    </nav>
  );
}
//make a list of menu items vertically center aligned in the middle of the screen with dark background
function MenuBar() {
  return (
    <div className="menuBar text-center">
      <br />
      <br />
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <div className="col-sm-12 pb-5">
              <h3>A web3 revolution in Entertainment is here</h3>
            </div>
            <div className="col-sm-12 pb-5">
              <h4>
                Get ready for a massive leap in ticketing through NFTs. Now your
                NFTs aren't just NFTs, they are tickets as well
              </h4>
            </div>
            
          </div>
          <div className="col-sm-3" style={{float:"none",margin:"auto"}}>
            <Image src={nftImg} className="im" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

const eventList = [
    {
      id: "1",
      name: "Event 1",
      description: "This is the first event",
      image: Image1,
      date: "2020-01-01",
      location: "Location 1",
      price: "100",
      tickets: "100",
    },
    {
      id: "2",
      name: "Event 2",
      description: "This is the second event",
      image: Image2,
      date: "2020-01-02",
      location: "Location 2",
      price: "200",
      tickets: "200",
    },
    {
      id: "3",
      name: "Event 2",
      description: "This is the second event",
      image: Image3,
      date: "2020-01-02",
      location: "Location 2",
      price: "200",
      tickets: "200",
    },
    {
      id: "4",
      name: "Event 2",
      description: "This is the second event",
      image: Image4,
      date: "2020-01-02",
      location: "Location 2",
      price: "200",
      tickets: "200",
    },
    {
      id: "5",
      name: "Event 2",
      description: "This is the second event",
      image: Image3,
      date: "2020-01-02",
      location: "Location 2",
      price: "200",
      tickets: "200",
    },
    {
      id: "6",
      name: "Event 2",
      description: "This is the second event",
      image: Image2,
      date: "2020-01-02",
      location: "Location 2",
      price: "200",
      tickets: "200",
    },
    {
      id: "7",
      name: "Event 2",
      description: "This is the second event",
      image: Image3,
      date: "2020-01-02",
      location: "Location 2",
      price: "200",
      tickets: "200",
    },
    {
      id: "8",
      name: "Event 2",
      description: "This is the second event",
      image: Image1,
      date: "2020-01-02",
      location: "Location 2",
      price: "200",
      tickets: "200",
    }
  ];

function UpcomingEvents() {
  return (
    <div className="upcomingEvents">
      <div className="container p-5">
        <br />
        <center>
          <h1 className="landing styl" style={{ color: "#d946fd" }}>
            UPCOMING EVENTS
          </h1>
        </center>
        <div className="row p-3">
          {eventList.map((event) => (
            <div className="col-sm-3 mb-4">
              <div className=''>
                <a href="">
                  <Image className="card" style={{borderRadius: 20}} src={event.image} alt="" />
                  <div className='card-overlay' style={{color: '#fff',
  margin: '40px auto',
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  width: '100%',
  borderRadius: '15px',
  padding: '32px',
  backdropFilter: 'blur(10px)',
  verticalAlign: 'bottom'}}>
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text">{event.description}</p>
                    <p className="card-text">
                      <small className="text">
                        {event.date} at {event.location}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text">
                        {event.price} ETH - {event.tickets} tickets
                      </small>
                    </p>
                    
                  </div>
                </a>
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// const style = {
//   background: "linear-gradient(to right, #cc00ff, #ff3399)",
//   position: "relative",
// };
function Line() {
  return (
    <div className="line">
      
    </div>
  );
}
function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <center>
              <h2 style={{ color: "#CC00FF" }}>NFTickets</h2>
            </center>
          </div>
          <center>
            <div>
              <a href="https://www.facebook.com/">
                <i className="fab fa-facebook-square fa-2x"></i>
              </a>
              <a href="https://www.instagram.com/">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a href="https://www.twitter.com/">
                <i className="fab fa-twitter-square fa-2x"></i>
              </a>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="gradient-custom">
      <NavBar />
      <Line />
      <br />
      <MenuBar />
      <UpcomingEvents />
      <Footer />
      <br />
    </div>
  );
}


export {NavBar, Line}
