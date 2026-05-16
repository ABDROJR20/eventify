import './page.css';

export default function Home() {
  return (
    <main className="landing-container">
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in">
          <div className="logo-badge">
            <h1>Eventify</h1>
            <div className="logo-underline"></div>
          </div>
          
          <h2 className="hero-title">
            Seamlessly Manage,<br />
            <span className="text-gradient">Effortlessly Attend</span>
          </h2>
          
          <p className="hero-subtitle">
            Experience the next generation of event curation. Whether you're the architect or the guest, we make every moment electric.
          </p>
          
          <button className="btn-primary">
            Get Started <span>→</span>
          </button>
          
          <div className="portal-cards">
            <div className="portal-card attendee">
              <div className="icon-box green">
                <i className="icon-user">👤</i>
              </div>
              <div className="card-info">
                <h3>Attendee</h3>
                <p>Find your next experience</p>
              </div>
            </div>
            
            <div className="portal-card organizer">
              <div className="icon-box blue">
                <i className="icon-organizer">📐</i>
              </div>
              <div className="card-info">
                <h3>Organizer</h3>
                <p>Design world-class events</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
