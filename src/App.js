import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { host, pesan, api, isJson } from './Module';
import "./App.css";

import Home from "./page/Home";
import Absen from "./page/Absen";
import Scan from "./page/Scan";
import Info from "./page/Info";
import Profile from "./page/Profile";

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {
        setIsInstalled(true);
      });
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDeferredPrompt(null);
      } else {
        console.log('User dismissed the install prompt');
      }
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <div style={{ position: "fixed", bottom: "100px", right: "20px" }}>
      {deferredPrompt && (
        <button onClick={handleInstallClick} className="btn btn-default" style={{ borderRadius: "50%" }}>
          <i className="fas fa-download"></i>
        </button>
      )}
    </div>
  );
};

function App() {
  let Token = localStorage.getItem("TokenUser");

  class Main extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Profile: {},
        Path: "/home"
      };
    }

    async componentDidMount() {
      let Path = window.location.pathname;
    }

    render() {
      return (
        <Router>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home page="Home" />} />
              <Route path="/home" element={<Home page="Home" />} />
              <Route path="/absen" element={<Absen page="Absen" />} />
              <Route path="/scan" element={<Scan page="Scan" />} />
              <Route path="/info" element={<Info page="Info" />} />
              <Route path="/profile" element={<Profile page="Profile" />} />
            </Routes>
          </div>

          <div className="menu-container">
            <div className="menu">
              <Link to="/home" id="menuHome" className={`menu-item ${this.state.Path == "/home" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/home" })}>
                <i className="fas fa-home"></i>
                <div className="menu-label">Home</div>
              </Link>
              <Link to="/absen" className={`menu-item ${this.state.Path == "/absen" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/absen" })}>
                <i className="fas fa-fingerprint"></i>
                <div className="menu-label">Absen</div>
              </Link>
              <Link to="/scan" className={`menu-item ${this.state.Path == "/scan" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/scan" })}>
                <i className="fas fa-qrcode"></i>
                <div className="menu-label">Scan</div>
              </Link>
              <Link to="/info" className={`menu-item ${this.state.Path == "/info" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/info" })}>
                <i className="fas fa-bell"></i>
                <div className="menu-label">Info</div>
              </Link>
              <Link to="/profile" className={`menu-item ${this.state.Path == "/profile" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/profile" })}>
                <i className="fas fa-user"></i>
                <div className="menu-label">Profile</div>
              </Link>
            </div>
          </div>
          <InstallButton />
          <div id="toast" className="hidden"></div>
        </Router>
      )
    }
  }

  class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        UserName: "",
        Password: "",
        Profile: {}
      };
      this.handleLogin = this.handleLogin.bind(this);
    }

    async componentDidMount() {
      let sql = await api("profile", { Domain: window.location.hostname });
      if (sql.status === "sukses") this.setState({ Profile: sql.data });
    }

    async handleLogin(e) {
      e.preventDefault();
      e.stopPropagation();
      let Form = e.target;
      let btn = Form.querySelector('button[type="submit"]');
      if (e.target.checkValidity()) {
        btn.disabled = true;
        let data = new FormData(Form);
        data.append("Domain", window.location.hostname);
        fetch(host + "login", {
          method: 'POST',
          body: data,
        }).then(response => response.text()).then(res => {
          if (isJson(res)) {
            let hasil = JSON.parse(res);
            if (hasil.status === "sukses") {
              localStorage.setItem("TokenUser", hasil.token);
              window.location.reload();
            } else {
              btn.disabled = false;
              pesan(hasil.pesan);
            }
          } else {
            btn.disabled = false;
            console.log(res);
            pesan("Terjadi kesalahan");
          }
        }).catch((error) => {
          btn.disabled = false;
          console.log("Error: " + error);
        });
      } else {
        Form.classList.add('was-validated');
        btn.disabled = false;
      }
    }

    render() {
      return (
        <Fragment>
          <div className="container d-flex align-items-center justify-content-center">
            <div className="card" style={{ width: "400px" }}>
              <div className="card-header pt-4 d-flex justify-content-between align-items-center">
                <img src={require('./logo.png')} alt="Logo" style={{ width: '75px', height: '75px', borderRadius: "50%" }} />
                <h4>{this.state.Profile.Nama}</h4>
              </div>
              <div className="card-body">
                <form className="needs-validation" onSubmit={this.handleLogin} noValidate>
                  <div className="mb-6">
                    <label htmlFor="Email" className="form-label">NIS</label>
                    <input type="text" className="form-control" name="NIS" value={this.state.UserName} onChange={(e) => this.setState({ UserName: e.target.value })} placeholder="Masukan Nomor Induk Siswa" required />
                    <div className="invalid-feedback">Silahkan isi NIS</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="Password" value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })} placeholder="Masukan Kata Sandi" required />
                    <div className="invalid-feedback">Silahkan isi Password</div>
                  </div>
                  <button type="submit" style={{ backgroundColor: "#32642d", color: "#fbbc05" }} className="btn btn-primary w-100">Masuk</button>
                </form>
              </div>
            </div>
          </div>
          <div id="toast"></div>
        </Fragment>
      )
    }
  }

  if (Token) {
    return <Main />;
  } else {
    return <Login />;
  }
}

export default App;
