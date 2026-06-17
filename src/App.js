import RegisterForm from './components/RegisterForm';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Inscription</h1>
            <RegisterForm />
            <footer>
                <a href={`${process.env.PUBLIC_URL}/docs/index.html`}>Documentation</a>
            </footer>
        </div>
    );
}

export default App;