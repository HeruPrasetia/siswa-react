import React, { Fragment } from 'react';
import { api, tanggalIndo, numberFormat } from '../Module';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            Detail: {},
            Payment: [],
            Order: "Date",
            By: "DESC",
            Page: "1"
        };
    }

    async componentDidMount() {
        this.handleMain();
    }

    handleSort(Sort) {
        let By = this.state.By;
        if (By == "DESC") {
            this.setState({ Sort: Sort, By: "ASC" })
        } else {
            this.setState({ Sort: Sort, By: "DESC" })
        }
        this.handleMain();
    }

    async handleMain() {
        let sql = await api("data", { act: "data arap", order: this.state.Order, by: this.state.By, page: this.state.Page });
        if (sql.status == "sukses") {
            this.setState({ Data: sql.data });
        }
    }

    async handleDetail(data) {
        let sql = await api("data", { act: "detail arap", DocNumber: data.DocNumber });
        if (sql.status == "sukses") {
            this.setState({ Detail: data, Payment: sql.data });
        }
    }

    render() {
        return (
            <Fragment>
                
          <div className="p-3">
                <h5 style={{ textAlign: "center" }}>Data Hutang</h5>
                <div className='table-responsive'>
                    <table className='table table-sm table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th onClick={() => this.handleSort("Date")}>Tanggal</th>
                                <th onClick={() => this.handleSort("DocNumber")}>Nomor</th>
                                <th onClick={() => this.handleSort("Amount")}>Jumlah</th>
                                <th>Dibayar</th>
                                <th onClick={() => this.handleSort("Balance")}>Sisa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.Data.map((tr, i) => {
                                    return (<tr key={i} onClick={() => this.handleDetail(tr)} data-bs-toggle="modal" data-bs-target="#modalDetail">
                                        <td>{tanggalIndo(tr.Date)}</td>
                                        <td>{tr.DocNumber}</td>
                                        <td>{numberFormat(tr.Amount)}</td>
                                        <td>{numberFormat(tr.Amount - tr.Balance)}</td>
                                        <td>{numberFormat(tr.Balance)}</td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="modal fade" id="modalDetail" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Detail Hutang</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <table className='table table-sm'>
                                    <thead>
                                        <tr>
                                            <th>Tanggal</th>
                                            <th>Jumlah</th>
                                            <th>Ke</th>
                                            <th>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.Payment.map((tr, i) => {
                                                return (<tr key={i}>
                                                    <td>{tanggalIndo(tr.DocDate)}</td>
                                                    <td>{numberFormat(tr.Amount)}</td>
                                                    <td>{tr.NamaAkun}</td>
                                                    <td>{tr.Notes}</td>
                                                </tr>)
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
            </Fragment>
        )
    }
}

export default Home;