import React, { Fragment } from 'react';
import Webcam from 'react-webcam';
import { pesan, submitForm, api, tanggalIndo, numberFormat, openModal } from '../Module';

class Absen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataJadwal: [],
            JamNow: "",
            Mode: "Masuk",
            host: window.location.hostname === "localhost" ? "http://localhost/siswaapi" : "https://siswaapi.naylatools.com",
            foto: null,
            isCameraActive: false,
            latitude: "",
            longitude: "",
            DataAbsen: []
        };
        this.updateClock = this.updateClock.bind(this);
        this.handleMasuk = this.handleMasuk.bind(this);
        this.handlePulang = this.handlePulang.bind(this);
        this.capture = this.capture.bind(this);
        this.switchCamera = this.switchCamera.bind(this);
        this.webcamRef = React.createRef();
    }

    componentDidMount() {
        setInterval(this.updateClock, 1000);

        // Add event listener to detect modal close
        const modal = document.getElementById('modalAbsen');
        modal.addEventListener('hidden.bs.modal', this.handleModalClose);
    }

    updateClock() {
        let now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        let timeString = `${hours}:${minutes}:${seconds}`;
        this.setState({ JamNow: timeString });
    }

    handleMasuk() {
        this.setState({ Mode: "Masuk", isCameraActive: true });
        openModal("modalAbsen");
    }

    handlePulang() {
        this.setState({ Mode: "Pulang", isCameraActive: true });
        openModal("modalAbsen");
    }

    handleModalClose = () => {
        this.setState({ isCameraActive: false });
    };

    switchCamera() {
        this.setState(prevState => ({
            facingMode: prevState.facingMode === "user" ? "environment" : "user"
        }));
    }

    capture() {
        const imageSrc = this.webcamRef.current.getScreenshot();
        this.setState({ foto: imageSrc, isCameraActive: false });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    this.setState({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location: ', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000, // 10 detik
                    maximumAge: 0
                }
            );
        } else {
            pesan("Silahkan izinkan apilkasi mengakses lokasi anda");
        }
    }

    render() {
        return (
            <Fragment>
                <div className='container'>
                    <h5 style={{ textAlign: "center" }}>Absensi</h5>
                    <div className='card shadow mb-2' style={{ height: "200px" }} onClick={this.handleMasuk}>
                        <div className='card-body d-flex justify-content-between align-items-start'>
                            <div className='d-flex gap-2'>
                                <i className='fas fa-sign-in-alt' style={{ fontSize: "40px" }}></i>
                                <h1>Masuk</h1>
                            </div>
                            <h1>{this.state.JamNow}</h1>
                        </div>
                    </div>
                    <div className='card shadow' style={{ height: "200px" }} onClick={this.handlePulang}>
                        <div className='card-body d-flex justify-content-between align-items-start'>
                            <div className='d-flex gap-2'>
                                <i className='fas fa-sign-out-alt' style={{ fontSize: "40px" }}></i>
                                <h1>Pulang</h1>
                            </div>
                            <h1>{this.state.JamNow}</h1>
                        </div>
                    </div>

                    <p></p>
                    <div className='table-responsive'>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Masuk</th>
                                    <th>Pulang</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.DataAbsen.length > 0 ?
                                    this.state.DataAbsen.map((tr, i) => {
                                        return (
                                            <tr>
                                                <td>{tr.Mulai}</td>
                                                <td>{tr.Mapel}</td>
                                                <td>{tr.Guru}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4}>Tdak ada absen</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="modal fade" id="modalAbsen" tabIndex="-1" aria-labelledby="modalAbsen" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={(e) => submitForm(e, { crud: "absen" })} noValidate>
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Absen {this.state.Mode}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    {this.state.isCameraActive && (
                                        <Webcam
                                            audio={false}
                                            ref={this.webcamRef}
                                            screenshotFormat="image/jpeg"
                                            width="100%"
                                            videoConstraints={{
                                                facingMode: this.state.facingMode
                                            }}
                                        />
                                    )}
                                    {this.state.foto && <img src={this.state.foto} alt="foto hasil" />}
                                    <button type='button' className='btn w-100' style={{ textAlign: "center" }} onClick={this.switchCamera}>Ganti Kamera</button>
                                    <p></p>
                                    <input type='hidden' name="Foto" value={this.state.foto} />
                                    <input type='hidden' name="Lokasi" value={`${this.state.latitude},${this.state.latitude}`} />
                                    <div className='d-flex justify-content-between align-items-center gap-2'>
                                        <button type='button' className='btn btn-default w-50' onClick={this.capture}>Ambil Foto</button>
                                        <button type='button' className='btn btn-default w-50' onClick={() => this.getLocation()}>Ambil Lokasi</button>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                    <button type="submit" className="btn btn-default">Absen</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Absen;
