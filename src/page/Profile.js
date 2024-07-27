import React, { Fragment } from 'react';
import { api } from '../Module';

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
                    <a href="#" className="list-group-item list-group-item-action" onClick={(e) => this.handleLogout()}>
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">Keluar</h5>
                        </div>
                        <p className="mb-1">Keluar aplikasi</p>
                    </a>
                </div>
            </Fragment>
        )
    }
}

export default Home;