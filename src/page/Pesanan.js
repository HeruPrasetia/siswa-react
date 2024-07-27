import React, { Fragment } from 'react';
import { api, saiki, tanggalIndo, numberFormat } from '../Module';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            Detail: {},
            Items: [],
            D1: saiki(),
            D2: saiki()
        };
    }

    async componentDidMount() {
        this.handleMain();
    }

    async handleMain() {
        let sql = await api("data", { act: "data sales", D1: this.state.D1, D2: this.state.D2 })
        if (sql.status = 'sukses') this.setState({ Data: sql.data });
    }

    async handleDetail(data) {
        let sql = await api("data", { act: "detail sales", DocNumber: data.DocNumber });
        if (sql.status == "sukses") this.setState({ Items: sql.data, Detail: data });
    }

    render() {
        return (<Fragment>
            
          <div className="p-4">
            <div className='d-flex justify-content-between align-items-center gap-2'>
                <input type="date" className='form-control' value={this.state.D1} onChange={(e) => this.setState({ D1: e.target.value })} />
                <input type="date" className='form-control' value={this.state.D2} onChange={(e) => this.setState({ D2: e.target.value })} />
                <button className='btn btn-primary' onClick={() => this.handleMain()}>Cari</button>
            </div>
            <p></p>
            <div className='table-responsive'>
                <table className='table table-stripped'>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>No,</th>
                            <th>Pembayaran</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.Data.map((tr, i) => {
                                return (
                                    <tr key={i} onClick={(e) => this.handleDetail(tr)} data-bs-toggle="modal" data-bs-target="#modalDetail">
                                        <td>{tanggalIndo(tr.DocDate)}</td>
                                        <td>{tr.DocNumber}</td>
                                        <td>{tr.PayType}</td>
                                        <td>{numberFormat(tr.GrandTotal)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="modal fade" id="modalDetail" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Detail Pembelian</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className='table table-sm'>
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Jumlah</th>
                                        <th>Harga</th>
                                        <th>Disc</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.Items.map((tr, i) => {
                                            return (<tr key={i}>
                                                <td>{tr.ItemName}</td>
                                                <td>{numberFormat(tr.Qty)}</td>
                                                <td>{numberFormat(tr.Price)}</td>
                                                <td>{numberFormat(tr.VDiscount)}</td>
                                                <td>{numberFormat(tr.Total)}</td>
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
        </Fragment>)
    }
}

export default Home;