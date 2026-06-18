import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import UserList from './components/UserList';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
    const [adminToken, setAdminToken] = useState(null);
    const isAdminPath = window.location.pathname.replace(/\/$/, '').endsWith('/admin');

    if (isAdminPath) {
        return (
            <div className="App">
                <h1>Administration</h1>
                {adminToken ? (
                    <AdminPanel token={adminToken} onLogout={() => setAdminToken(null)} />
                ) : (
                    <AdminLogin onLoginSuccess={setAdminToken} />
                )}
            </div>
        );
    }

    return (
        <div className="App">
            <h1>Inscription</h1>
            <RegisterForm />
            <h2>Inscrits</h2>
            <UserList />
            <footer>
                <a href={`${process.env.PUBLIC_URL}/docs/index.html`}>Documentation</a>
            </footer>
        </div>
    );
}

export default App;