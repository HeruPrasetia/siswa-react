import React, { Fragment } from 'react';
import { pesan, submitForm, api, tanggalIndo, numberFormat, openModal } from '../Module';
import { DataMaskValues } from '@zxing/library/esm/core/qrcode/decoder/DataMask';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataPelajaran: [],
            DataEks: [],
            host: window.location.hostname === "localhost" ? "http://localhost/siswaapi" : "https://siswaapi.naylatools.com"
        };
    }

    async componentDidMount() {
        let sql = await api("datasiswa", { act: "data jadwal" });
        console.log(sql);
        if (sql.status == "sukses") this.setState({ DataPelajaran: sql.pelajaran, DataEks: sql.eks });
    }

    render() {
        return (
            <Fragment>
                <div className='container'>
                    <h5 style={{ textAlign: "center" }}>Jadwal Pelajaran</h5>
                    <div className='table-responsive'>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Jam</th>
                                    <th>Pelajaran</th>
                                    <th>Guru</th>
                                    <th>Selesai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.DataPelajaran.length > 0 ?
                                    this.state.DataPelajaran.map((tr, i) => {
                                        return (
                                            <tr>
                                                <td>{tr.JamMulai}</td>
                                                <td>{tr.NamaPelajaran}</td>
                                                <td>{tr.NamaPengawas}</td>
                                                <td>{tr.JamSelesai}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4}>Tdak ada jadwal</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <h5 style={{ textAlign: "center" }}>Jadwal Ekstrakurikuler</h5>
                    <div className='table-responsive'>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Mulai</th>
                                    <th>Ekstrakurikuler</th>
                                    <th>Guru</th>
                                    <th>Selesai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.DataEks.length > 0 ?
                                    this.state.DataEks.map((tr, i) => {
                                        return (
                                            <tr>
                                                <td>{tr.JamMulai}</td>
                                                <td>{tr.NamaPelajaran}</td>
                                                <td>{tr.NamaPengawas}</td>
                                                <td>{tr.JamSelesai}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4}>Tdak ada jadwal</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

            </Fragment>
        )
    }
}

export default Home;