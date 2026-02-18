import { useState } from 'react';
import Home from './pages/Home';
import CardDatabase from './pages/CardDatabase';

function App() {
    const [currentPage, setCurrentPage] = useState<'home' | 'database'>('home');

    return (
        <div className="app-container" style={{ position: 'relative', height: '100vh', width: '100vw' }}>

            {/* Background Effects */}
            <div className="moving-bars">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="bar" style={{ left: `${i * 5}%`, animationDelay: `${i * -0.5}s` }} />
                ))}
            </div>
            <div className="scan-lines" />

            {/* Pages */}
            {currentPage === 'home' && (
                <Home onNavigate={setCurrentPage} />
            )}

            {currentPage === 'database' && (
                <CardDatabase onNavigate={setCurrentPage} />
            )}
        </div>
    );
}

export default App;
