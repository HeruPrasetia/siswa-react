import React, { Fragment } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataJadwal: [],
            host: window.location.hostname === "localhost" ? "http://localhost/siswaapi" : "https://siswaapi.naylatools.com",
            scanResult: '',
            isCameraFront: false
        };
        this.videoRef = React.createRef();
        this.codeReader = new BrowserMultiFormatReader();
        this.handleScan = this.handleScan.bind(this);
        this.toggleCamera = this.toggleCamera.bind(this);
    }

    componentDidMount() {
        this.codeReader.decodeFromVideoDevice(null, this.videoRef.current, (result, err) => {
            if (result) {
                this.handleScan(result.getText());
            }
            if (err && !(err instanceof NotFoundException)) {
                console.error(err);
            }
        });
    }

    componentWillUnmount() {
        this.codeReader.reset();
    }

    async handleScan(data) {
        this.setState({ scanResult: data });
        console.log(data);
    }

    toggleCamera() {
        this.setState(prevState => {
            const newCamera = !prevState.isCameraFront;
            this.codeReader.reset(); // Reset scanner sebelum memulai yang baru
            return { isCameraFront: newCamera };
        }, () => {
            this.startScanning(); // Mulai scanning dengan kamera baru setelah state diperbarui
        });
    }

    render() {
        return (
            <Fragment>
                <Fragment>
                    <div className='container'>
                        <h5 style={{ textAlign: "center" }}>Scan Data</h5>
                        <div className='d-flex justify-content-center align-items-center'>
                            <video ref={this.videoRef} style={{ width: '100%' }} />
                        </div>
                        <button onClick={this.toggleCamera} className="btn w-100">
                            {this.state.isCameraFront ? 'Gunakan Kamera Belakang' : 'Gunakan Kamera Depan'}
                        </button>
                        {this.state.scanResult && (
                            <div className='mt-3'>
                                <h6>Hasil Scan:</h6>
                                <p>{this.state.scanResult}</p>
                            </div>
                        )}
                    </div>
                </Fragment>
            </Fragment>
        )
    }
}

export default Home;
