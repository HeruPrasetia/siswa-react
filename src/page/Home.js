import React, { Fragment } from 'react';
import { pesan, submitForm, api, tanggalIndo, numberFormat, openModal } from '../Module';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataJadwal: [],
            host: window.location.hostname === "localhost" ? "http://localhost/siswaapi" : "https://siswaapi.naylatools.com"
        };
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
                                {this.state.DataJadwal.length > 0 ?
                                    this.state.DataJadwal.map((tr, i) => {
                                        return (
                                            <tr>
                                                <td>{tr.Mulai}</td>
                                                <td>{tr.Mapel}</td>
                                                <td>{tr.Guru}</td>
                                                <td>{tr.Selesai}</td>
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
                                    <th>Ekstrakurikuler</th>
                                    <th>Jam</th>
                                    <th>Guru</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.DataJadwal.length > 0 ?
                                    this.state.DataJadwal.map((tr, i) => {
                                        return (
                                            <tr>
                                                <td>{tr.Mulai}</td>
                                                <td>{tr.Mapel}</td>
                                                <td>{tr.Guru}</td>
                                                <td>{tr.Selesai}</td>
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