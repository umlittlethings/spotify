import { handleLogin } from './spotify';
import './index.css';

export default function Login() {
  return (
    <div className="login">
      <img
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt="Spotify Logo"
        className="login__logo"
      />
      <button onClick={handleLogin} className="login__button">
        Login with Spotify
      </button>
    </div>
  );
}
