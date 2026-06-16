export default function Toast({ message, type, visible }) {
    if (!visible) return null;
    return (
        <div data-testid="toast" className={`toast toast-${type}`}>
            {message}
        </div>
    );
}