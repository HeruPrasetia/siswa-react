import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { host, pesan, api, isJson } from './Module';
import "./App.css";

import Home from "./page/Home";
import Absen from "./page/Absen";
import Scan from "./page/Scan";
import Info from "./page/Info";
import Profile from "./page/Profile";

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
      // let sql = await api("data", { act: "data profile" });
      // if (sql.status == "sukses") {
      //   this.setState({ Profile: sql.profile, Path: Path });
      //   document.title = sql.profile.Nama
      // }
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
              <Link to="/home" className={`menu-item ${this.state.Path == "/home" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/home" })}>
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
        Mode: "Login",
        Nama: "",
        Email: "",
        Telp: "",
        Alamat: "",
        Pwd: "",
        RePwd: "",
        ProvinsiID: 0,
        KotaID: 0,
        KecamatanID: 0,
        DataProvinsi: [],
        DataKota: [],
        DataKec: []
      };
    }

    componentDidMount() {
      this.handleGetAlamat("provinsi");
    }

    async handleLogin(e) {
      e.preventDefault();
      e.stopPropagation();
      let Form = e.target;
      let btn = Form.querySelector('button[type="submit"]');
      if (e.target.checkValidity()) {
        btn.disabled = true;
        let data = new FormData(Form)
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

    handleDaftar(e) {
      e.preventDefault();
      e.stopPropagation();
      let Form = e.target;
      let btn = Form.querySelector('button[type="submit"]');
      if (e.target.checkValidity()) {
        btn.disabled = true;
        let data = new FormData(Form)
        data.append("Domain", window.location.hostname);
        fetch(host + "daftar", {
          method: 'POST',
          body: data,
        }).then(response => response.text()).then(res => {
          if (isJson(res)) {
            let hasil = JSON.parse(res);
            if (hasil.status === "sukses") {
              this.setState({ Mode: "Login", UserName: this.state.Email, Password: this.state.Pwd });
            } else {
              btn.disabled = false;
              pesan(hasil.pesan);
            }
          } else {
            console.log(res);
            btn.disabled = false;
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

    async handleGetAlamat(type = "provinsi", ID = 0) {
      let sql = await api("data_api", { act: `data ${type}`, ID: ID });
      if (sql.status == "sukses") {
        if (type == "provinsi") {
          this.setState({ DataProvinsi: sql.data, ProvinsiID: ID });
        } else if (type == "kota") {
          this.setState({ DataKota: sql.data, ProvinsiID: ID });
        } else if (type == "kecamatan") {
          this.setState({ DataKec: sql.data, KotaID: ID });
        } else {
          this.setState({ KecamatanIDID: ID });
        }
      }
    }

    render() {
      return (
        <Fragment>
          <div className="container d-flex align-items-center justify-content-center">
            <div className="card" style={{ width: "400px" }}>
              <div className="card-header pt-4 d-flex justify-content-between align-items-center">
                <img src={require('./logo.png')} alt="Logo" style={{ width: '75px', height: '75px', borderRadius: "50%" }} />
                <h4>MA DARUL ULUM WARU</h4>
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
  return <Main />

  // if (Token) {
  //   return <Main />
  // } else {
  //   return <Login />
  // }
}

export default App;
