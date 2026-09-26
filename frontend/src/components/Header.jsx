function Header({ onHome, onAbout, onVirtualLab, currentView }) {
    return (
        <header className="header">
            <div className="header-content">

                <div className="logo" onClick={onHome} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">🧠</span>
                    <h1>AI Learn &amp; Visualize</h1>
                </div>

                <nav className="nav">

                    <a
                        href="#home-section"
                        className={`nav-link ${currentView === 'learn' ? 'active-nav' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onHome?.();
                            document.getElementById("home-section")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Home
                    </a>

                    <a
                        href="#virtual-lab"
                        className={`nav-link nav-virtual-lab-btn ${currentView === 'virtual-lab' ? 'active-nav active-lab' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onVirtualLab?.();
                        }}
                    >
                        <span className="lab-nav-sparkle">🔬</span> Virtual Lab
                    </a>

                    <a
                        href="#learn-section"
                        className="nav-link"
                        onClick={(e) => {
                            if (currentView !== 'learn') {
                                e.preventDefault();
                                onHome?.();
                            }
                        }}
                    >
                        Learn
                    </a>

                    <a
                        href="#practice-section"
                        className="nav-link"
                        onClick={(e) => {
                            if (currentView !== 'learn') {
                                e.preventDefault();
                                onHome?.();
                            }
                        }}
                    >
                        Practice
                    </a>

                    <a
                        href="#about"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            onAbout?.();
                            document.getElementById("about")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        About
                    </a>

                </nav>
            </div>
        </header>
    );
}

export default Header;