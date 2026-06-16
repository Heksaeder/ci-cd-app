import RegisterForm from './components/RegisterForm';

function App() {
    return (
        <div>
            <h1>Inscription</h1>
            <RegisterForm />
            <footer>
                <a href={`${process.env.PUBLIC_URL}/docs/index.html`}>Documentation</a>
            </footer>
        </div>
    );
}

export default App;