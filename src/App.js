import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { host, pesan, api, isJson } from './Module';
import "./App.css";

import Home from "./page/Home";
import Piutang from "./page/Piutang";
import Pesanan from "./page/Pesanan";
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
      let sql = await api("data", { act: "data profile" });
      if (sql.status == "sukses") {
        this.setState({ Profile: sql.profile, Path: Path });
        document.title = sql.profile.Nama
      }
    }

    render() {
      return (
        <Router>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home page="Home" />} />
              <Route path="/home" element={<Home page="Home" />} />
              <Route path="/piutang" element={<Piutang page="piutang" />} />
              <Route path="/pesanan" element={<Pesanan page="pesanan" />} />
              <Route path="/profile" element={<Profile page="Home" />} />
            </Routes>
          </div>

          <div className="menu-container">
            <div className="menu">
              <Link to="/home" className={`menu-item ${this.state.Path == "/home" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/home" })}>
                <i className="fas fa-home"></i>
                <div className="menu-label">Home</div>
              </Link>
              <Link to="/piutang" className={`menu-item ${this.state.Path == "/piutang" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/piutang" })}>
                <i className="fas fa-list-alt"></i>
                <div className="menu-label">Piutang</div>
              </Link>
              <Link to="/pesanan" className={`menu-item ${this.state.Path == "/pesanan" ? "active-menu" : ""}`} onClick={() => this.setState({ Path: "/pesanan" })}>
                <i className="fas fa-shopping-cart"></i>
                <div className="menu-label">Pembelian</div>
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
            <div className="card">
              <div className="card-header pt-4">
                <img src="bpLogo.png" alt="Logo" style={{ width: '100%', height: 'auto' }} />
                <ul className="nav nav-pills card-header-pills mt-4">
                  <li className="nav-item" style={{ cursor: "pointer" }}>
                    <a
                      className={`nav-link ${this.state.Mode === 'Login' ? 'active' : ''}`}
                      onClick={() => this.setState({ Mode: 'Login' })}
                    >
                      Sign in
                    </a>
                  </li>
                  <li className="nav-item" style={{ cursor: "pointer" }}>
                    <a
                      className={`nav-link ${this.state.Mode === 'Signup' ? 'active' : ''}`}
                      onClick={() => this.setState({ Mode: 'Signup' })}
                    >
                      Sign up
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {this.state.Mode === 'Login' ? (
                  <form className="needs-validation" onSubmit={this.handleLogin} noValidate>
                    <div className="mb-3">
                      <label htmlFor="Email" className="form-label">Username</label>
                      <input type="text" className="form-control" name="Email" value={this.state.UserName} onChange={(e) => this.setState({ UserName: e.target.value })} required />
                      <div className="invalid-feedback">Silahkan isi Username</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="Password" className="form-label">Password</label>
                      <input type="password" className="form-control" name="Password" value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })} required />
                      <div className="invalid-feedback">Silahkan isi Password</div>
                    </div>
                    <button type="submit"  style={{ backgroundColor:"#7498ba" }} className="btn btn-primary w-100">Sign in</button>
                  </form>
                ) : (
                  <form className="needs-validation signup-form" onSubmit={this.handleDaftar} noValidate>
                    <div className="mb-3">
                      <label htmlFor="Nama" className="form-label">Nama Lengkap</label>
                      <input type="text" className="form-control" name="Nama" value={this.state.Nama} onChange={(e) => this.setState({ Nama: e.target.value })} required />
                      <div className="invalid-feedback">Silahkan isi Nama</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="Email" className="form-label">Email</label>
                      <input type="email" className="form-control" name="Email" value={this.state.Email} onChange={(e) => this.setState({ Email: e.target.value })} required />
                      <div className="invalid-feedback">Silahkan isi Email</div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="Telp" className="form-label">Telp</label>
                        <input type="tel" className="form-control" name="Telp" value={this.state.Telp} onChange={(e) => this.setState({ Telp: e.target.value })} required />
                        <div className="invalid-feedback">Silahkan isi Telp</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="ProvinsiID" className="form-label">Provinsi</label>
                        <select className="form-select" name="ProvinsiID" value={this.state.ProvinsiID} onChange={(e) => this.handleGetAlamat('kota', e.target.value)} required>
                          <option value="">Silahkan pilih provinsi</option>
                          {this.state.DataProvinsi.map((opt, i) => (
                            <option key={i} value={opt.ID}>{opt.Nama}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">Silahkan Pilih Provinsi</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="KotaID" className="form-label">Kota</label>
                        <select className="form-select" name="KotaID" value={this.state.KotaID} onChange={(e) => this.handleGetAlamat('kecamatan', e.target.value)} required>
                          {this.state.DataKota.map((opt, i) => (
                            <option key={i} value={opt.ID}>{opt.Nama}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">Silahkan Pilih Kota</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="KecamatanID" className="form-label">Kecamatan</label>
                        <select
                          className="form-select"
                          name="KecamatanID"
                          value={this.state.KecamatanID}
                          onChange={(e) => this.setState({ KecamatanID: e.target.value })}
                          required
                        >
                          {this.state.DataKec.map((opt, i) => (
                            <option key={i} value={opt.ID}>{opt.Nama}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">Silahkan Pilih Kecamatan</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="Password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="Password"
                        value={this.state.Pwd}
                        onChange={(e) => this.setState({ Pwd: e.target.value })}
                        placeholder="Masukan Password"
                        required
                      />
                      <div className="invalid-feedback">Silahkan isi Password</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="RePassword" className="form-label">Confirm password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="RePassword"
                        value={this.state.RePwd}
                        onChange={(e) => this.setState({ RePwd: e.target.value })}
                        placeholder="Masukan Kembali Password"
                        required
                      />
                      <div className="invalid-feedback">Silahkan isi Password Kembali</div>
                    </div>
                    <button type="submit" style={{ backgroundColor:"#7498ba" }} className="btn btn-primary w-100">Sign up</button>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div id="toast"></div>
        </Fragment>
      )
    }
  }

  if (Token) {
    return <Main />
  } else {
    return <Login />
  }
}

export default App;
