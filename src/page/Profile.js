import React, { Fragment } from 'react';
import { Token } from '../Module';
import QRCode from 'qrcode.react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: {}
        };
    }

    handleLogout() {
        localStorage.removeItem("TokenUser");
        window.location.href = "./";
    }

    render() {
        return (
            <Fragment>
                <div className="list-group p-3">
                    <a href="#" className="list-group-item list-group-item-action" aria-current="true">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">Edit Profile</h5>
                        </div>
                        <p className="mb-1">Menu untuk edit profile</p>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">Ganti Password</h5>
                        </div>
                        <p className="mb-1">Menu untuk ganti kata sandi</p>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action" data-bs-toggle="modal" data-bs-target="#modalQR">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">Tampilkan QR-Code</h5>
                        </div>
                        <p className="mb-1">Menampilkan qrcode anda untuk absen atau mengikiti kelas</p>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action" onClick={(e) => this.handleLogout()}>
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">Keluar</h5>
                        </div>
                        <p className="mb-1">Keluar aplikasi</p>
                    </a>
                </div>

                <div className="modal fade" id="modalQR" tabIndex="-1" aria-labelledby="modalAbsen" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">QR-Code</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <QRCode value={Token} style={{ width: "100%", height: "300px" }} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Home;