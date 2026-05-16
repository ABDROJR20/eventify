import './portal.css';

export default function Portal() {
  return (
    <main className="portal-container">
      <nav className="portal-nav">
        <h1 className="logo">Eventify</h1>
        <div className="nav-links">
          <span>Help Center</span>
          <button className="btn-text">Sign Out</button>
        </div>
      </nav>

      <div className="portal-content">
        <h2 className="portal-title">
          How will you <span className="logo-text">Eventify</span> today?
        </h2>
        <p className="portal-subtitle">
          Choose your portal to start crafting experiences or discovering your next great adventure.
        </p>

        <div className="portal-grid">
          <div className="selection-card attendee-card">
            <div className="card-top">
              <div className="selection-icon attendee-icon">
                👤
              </div>
              <div className="overlay-icon">🧭</div>
            </div>
            <div className="card-body">
              <h3>Attendee</h3>
              <p>Join events, discover unique local experiences, and connect with communities that share your passion.</p>
              <button className="selection-btn">Get Started <span>→</span></button>
            </div>
          </div>

          <div className="selection-card organizer-card">
            <div className="card-top">
              <div className="selection-icon organizer-icon">
                📐
              </div>
              <div className="overlay-icon">📈</div>
            </div>
            <div className="card-body">
              <h3>Organizer</h3>
              <p>Create events, manage registrations, track analytics, and architect unforgettable moments for your guests.</p>
              <button className="selection-btn">Build Event <span>→</span></button>
            </div>
          </div>
        </div>

        <div className="switch-info-bar">
          <div className="info-text">
            <h4>Can I switch later?</h4>
            <p>Absolutely. Your account is unified. You can seamlessly switch between attendee and organizer portals at any time from your profile settings.</p>
          </div>
          <div className="users-badge">
            <div className="user-avatars">
              <img src="https://i.pravatar.cc/150?u=1" alt="User" />
              <img src="https://i.pravatar.cc/150?u=2" alt="User" />
              <img src="https://i.pravatar.cc/150?u=3" alt="User" />
            </div>
            <span>Joined by 20k+ creators</span>
          </div>
        </div>
      </div>
    </main>
  );
}
