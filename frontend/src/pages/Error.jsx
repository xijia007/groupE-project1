import "./Error.css";

export default function Error({ message }) {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="icon">!</div>
        <h1>{message || "Oops, something went wrong!"}</h1>
        <button className="btn" onClick={() => (window.location.href = "/")}>
          Go Home
        </button>
      </div>
    </div>
  );
}
