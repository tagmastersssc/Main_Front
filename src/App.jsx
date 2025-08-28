import SocialLogin from "./components/SocialLogin";
import InputField from "./components/InputField";
import logo from "/bilailogocompleto.png";

export default function App() {
  return (
    <>
      <header className="top-header">
        <a href="/" className="header-brand">
          <img src={logo} alt="Mi Empresa" className="header-logo" />
        </a>
      </header>

      <main className="page-wrapper">
        <div className="login-container">
          <h2 className="form-title">Iniciar sesión</h2>
          <SocialLogin />
          <p className="separator"><span>o</span></p>
          <form action="#" className="login-form">
            <InputField type="email" placeholder="Correo electrónico" icon="mail" />
            <InputField type="password" placeholder="Contraseña" icon="lock" />
            <a href="#" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
            <button type="submit" className="login-button">Ingresar</button>
          </form>
          <p className="signup-prompt">
            ¿No tienes una cuenta? <a href="#" className="signup-link">Regístrate</a>
          </p>
        </div>
        <footer className="disclaimer-wrapper" aria-label="Aviso legal">
  <p className="disclaimer">
    Al ingresar aceptas nuestros <a href="/terms" className="disclaimer-link">Términos de Servicio</a> y confirmas que has leído la <a href="/privacy" className="disclaimer-link">Política de Privacidad</a>. <span className="disclaimer-company">BilAI © 2025</span>
  </p>
</footer>
      </main>
    </>
  );
}