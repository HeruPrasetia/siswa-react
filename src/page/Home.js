import React, { Fragment } from 'react';
import { pesan, submitForm, api, tanggalIndo, numberFormat, openModal } from '../Module';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            JenisKomplain: "Penagihan Hutang",
            Komplain: "",
            DocNumber: "",
            DataTrans: [],
            Detail: {},
            DetailTrans: [],
            NamaPerusahaan: "",
            NamaPemohon: "",
            NoHP: "",
            Jabatan: "",
            Alamat: "",
            NamaDinas: "",
            AlamatDinas: "",
            NamaPerwakilan: "",
            KodePaket: "",
            NamaPaket: "",
            LokasiPaket: "",
            VolumePekerjaan: "",
            PanjangJalan: "",
            LebarJalan: "",
            IsPabrikan: true,
            DataKunjungan: [],
            host: window.location.hostname === "localhost" ? "http://localhost/pos" : "https://apps.gijutsusoftware.com"
        };
    }

    async handleModalTrans() {
        let sql = await api("data", { act: "data trans project" });
        if (sql.status == "sukses") {
            this.setState({ DataTrans: sql.data });
            openModal("modalTrans");
        } else {
            pesan("Tidak ada transaksi");
        }
    }

    handlePilihTrans(data) {
        let dd = [], ddd = JSON.parse(data.Details);
        console.log(ddd);
        Object.keys(ddd).forEach((key) => {
            dd.push({ obj: key, val: ddd[key] });
        });
        this.setState({ DetailTrans: dd, Detail: data });
        openModal("modalDetailTrans");
    }

    handleMain() {
        document.getElementById('btnTutupFormReq').click();
    }

    addSpaceToCamelCase(str) {
        return str.replace(/([A-Z])/g, ' $1').trim();
    }

    async handleJadwalKunjungan() {
        let sql = await api("data", { act: "data kunjungan" });
        if (sql.status == "sukses") this.setState({ DataKunjungan: sql.data });
    }

    handleAddUji() {
        this.setState({
            NamaPerusahaan: "",
            NamaPemohon: "",
            NoHP: "",
            Jabatan: "",
            Alamat: "",
            NamaDinas: "",
            AlamatDinas: "",
            NamaPerwakilan: "",
            KodePaket: "",
            NamaPaket: "",
            LokasiPaket: "",
            VolumePekerjaan: "",
            PanjangJalan: "",
            LebarJalan: "",
            IsPabrikan: true,
        });
    }

    render() {
        return (
            <Fragment>
                <div className='container'>
                    <div className='row mb-2'>
                        <div className='col-6'>
                            <div className='card shadow' style={{ textAlign: "center", padding: "20px" }} data-bs-toggle="modal" data-bs-target="#modalReqUjiLab" onClick={(e) => this.handleAddUji()}>
                                <i className='fas fa-flask' style={{ fontSize: "100px", color: "#004578" }}></i>
                                <h6>Ajukan Uji Lab</h6>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='card shadow' style={{ textAlign: "center", padding: "20px" }} data-bs-toggle="modal" onClick={(e) => this.handleJadwalKunjungan()} data-bs-target="#modalJadwalKunjungan">
                                <i className='fas fa-street-view' style={{ fontSize: "100px", color: "#004578" }}></i>
                                <h6>Lihat Jadwal Kunjungan</h6>
                            </div>
                        </div>
                    </div>

                    <div className='row mb-2'>
                        <div className='col-6'>
                            <div className='card shadow' style={{ textAlign: "center", padding: "20px" }} data-bs-toggle="modal" data-bs-target="#modalCustomerService">
                                <i className='far fa-comment-dots' style={{ fontSize: "100px", color: "#004578" }}></i>
                                <h6>Customer Service</h6>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='card shadow' style={{ textAlign: "center", padding: "20px" }} onClick={(e) => this.handleModalTrans()}>
                                <i className='fas fa-info' style={{ fontSize: "100px", color: "#004578" }}></i>
                                <h6>Status</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalCustomerService" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form className='needs-validation' onSubmit={(e) => submitForm(e, { crud: "data" })} noValidate >
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Layanan Customer Service</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input type='hidden' name="act" value="input_layanan_customer_service" />
                                    <div className='form-group mb-2'>
                                        <label>Jenis Layanan</label>
                                        <select className='form-select' name='Jenis' value={this.state.JenisLayanan} onChange={(e) => this.setState({ JenisLayanan: e.target.value })} required>
                                            <option value="">Pilih Jenis Layanan</option>
                                            <option value="Bertanya terkait Pengujian Lab">Bertanya terkait Pengujian Lab</option>
                                            <option value="Uji Lab yang Berjalan">Uji Lab yang Berjalan</option>
                                        </select>
                                        <div className='invalid-feedback'>Silakan pilih jenis layanan</div>
                                    </div>
                                    {
                                        this.state.JenisLayanan === "Uji Lab yang Berjalan" &&
                                        <div className='form-group mb-2'>
                                            <label>Nomor Pengajuan Uji Lab</label>
                                            <select className='form-select' name='NoPengajuanUji' value={this.state.NoPengajuanUji} onChange={(e) => this.setState({ NoPengajuanUji: e.target.value })} required>
                                                <option value="">Pilih Atas Layanan Uji Lab</option>
                                                <option value="Pemeriksaan Kualitas Air">FORM228798</option>
                                                <option value="Analisis Tanah">FORM228798</option>
                                                <option value="Pemeriksaan Makanan">FORM228798</option>
                                            </select>
                                            <div className='invalid-feedback'>Silakan Pilih Nomor Pengajuan Uji Lab</div>
                                        </div>
                                    }
                                    <div className='form-group mb-2'>
                                        <label>Pertanyaan atau Keterangan</label>
                                        <textarea name="Pertanyaan" value={this.state.Pertanyaan} onChange={(e) => this.setState({ Pertanyaan: e.target.value })} className='form-control' required />
                                        <div className='invalid-feedback'>Silakan isi pertanyaan atau keterangan Anda</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                    <button type="submit" className="btn btn-primary"><i className='fas fa-save'></i> Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalReqUjiLab" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form className='needs-validation' onSubmit={(e) => submitForm(e, { crud: "crud", debug: true, fn: () => this.handleMain })} noValidate>
                                <input type='hidden' name="act" value="req project" />
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Form Pengajuan Uji Lab</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Nama Perusahaan</label>
                                                <input className='form-control' name="NamaPerusahaan" value={this.state.NamaPerusahaan} onChange={(e) => this.setState({ NamaPerusahaan: e.target.value })} required />
                                                <div className='invalid-feedback'>Silahkan isi nama perusahaan</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Nama Pemohon</label>
                                                <input className='form-control' name="NamaPemohon" value={this.state.NamaPemohon} onChange={(e) => this.setState({ NamaPemohon: e.target.value })} required />
                                                <div className='invalid-feedback'>Silahkan isi nama pemohon</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>No. HP</label>
                                                <input className='form-control' name="NoHP" value={this.state.NoHP} onChange={(e) => this.setState({ NoHP: e.target.value })} required />
                                                <div className='invalid-feedback'>Silahkan isi nomor HP</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Jabatan</label>
                                                <input className='form-control' name="Jabatan" value={this.state.Jabatan} onChange={(e) => this.setState({ Jabatan: e.target.value })} required />
                                                <div className='invalid-feedback'>Silahkan isi jabatan</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-group mb-2'>
                                        <label>Alamat</label>
                                        <textarea className='form-control' name="Alamat" value={this.state.Alamat} onChange={(e) => this.setState({ Alamat: e.target.value })} required />
                                        <div className='invalid-feedback'>Silahkan isi alamat</div>
                                    </div>
                                    <div className='form-group mb-2'>
                                        <label>Nama Dinas Pemberi Pekerjaan</label>
                                        <input className='form-control' name="NamaDinas" value={this.state.NamaDinas} onChange={(e) => this.setState({ NamaDinas: e.target.value })} required />
                                        <div className='invalid-feedback'>Silahkan isi nama dinas</div>
                                    </div>

                                    <div className='form-group mb-2'>
                                        <label>Alamat Dinas</label>
                                        <textarea className='form-control' name="AlamatDinas" value={this.state.AlamatDinas} onChange={(e) => this.setState({ AlamatDinas: e.target.value })} required />
                                        <div className='invalid-feedback'>Silahkan isi alamat dinas</div>
                                    </div>

                                    <div className='form-group mb-2'>
                                        <label>Perwakilan Dinas</label>
                                        <input className='form-control' name="NamaPerwakilan" value={this.state.NamaPerwakilan} onChange={(e) => this.setState({ NamaPerwakilan: e.target.value })} required />
                                        <div className='invalid-feedback'>Silahkan isi nama perwakilan dinas</div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Kode Paket</label>
                                                <input className='form-control' name="KodePaket" value={this.state.KodePaket} onChange={(e) => this.setState({ KodePaket: e.target.value })} required />
                                                <div className='invalid-feedback'>Silahkan isi kode paket</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Nama Paket</label>
                                                <input className='form-control' name="NamaPaket" value={this.state.NamaPaket} onChange={(e) => this.setState({ NamaPaket: e.target.value })} required />
                                                <div className='invalid-feedback'>Silahkan isi nama paket</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Lokasi Paket</label>
                                                <input className='form-control' name="LokasiPaket" value={this.state.LokasiPaket} onChange={(e) => this.setState({ LokasiPaket: e.target.value })} required />
                                                <div className='invalid-feedback'>Silahkan isi lokasi paket</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Volume Pekerjaan</label>
                                                <div className='input-group'>
                                                    <input className='form-control' name="VolumePekerjaan" value={this.state.VolumePekerjaan} onChange={(e) => this.setState({ VolumePekerjaan: e.target.value })} required />
                                                    <span className="input-group-text">Meter</span>
                                                </div>
                                                <div className='invalid-feedback'>Silahkan isi volume pekerjaan</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Panjang jalan</label>
                                                <div className='input-group'>
                                                    <input className='form-control' name="PanjangJalan" value={this.state.PanjangJalan} onChange={(e) => this.setState({ PanjangJalan: e.target.value })} required />
                                                    <span className="input-group-text">Meter</span>
                                                </div>
                                                <div className='invalid-feedback'>Silahkan isi panjang jalan</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Lebar Jalan</label>
                                                <div className='input-group'>
                                                    <input className='form-control' name="LebarJalan" value={this.state.LebarJalan} onChange={(e) => this.setState({ LebarJalan: e.target.value })} required />
                                                    <span className="input-group-text">Meter</span>
                                                </div>
                                                <div className='invalid-feedback'>Silahkan isi lebar jalan</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-3'>
                                                <label>Upload Kontrak Kerja / SPK</label>
                                                <input type="file" className='form-control' name="KontrakSPK" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-3'>
                                                <label>Upload RAB (Tidak Wajib)</label>
                                                <input type="file" className='form-control' name="RAB" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-3'>
                                                <label>Upload Gambar Kerja (Tidak Wajib)</label>
                                                <input type="file" className='form-control' name="GambarKerja" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-3'>
                                                <label>Upload MC 0 (Tidak Wajib)</label>
                                                <input type="file" className='form-control' name="MC0" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" role="switch" id="chkStatus" onChange={(e) => this.setState({ IsPabrikan: e.target.checked })} checked={this.state.IsPabrikan} />
                                        <label className="form-check-label" htmlFor="chkStatus">Pabrikan Pendukung</label>
                                    </div>

                                    <div className='form-group mb-2'>
                                        <label>Nama Pabrikan pendukung</label>
                                        <input className='form-control' name="NamaPabrikan" value={this.state.NamaPabrikan} onChange={(e) => this.setState({ NamaPabrikan: e.target.value })} required disabled={this.state.IsPabrikan == false ? true : false} />
                                        <div className='invalid-feedback'>Silahkan isi nama pabrikan</div>
                                    </div>
                                    <div className='form-group mb-2'>
                                        <label>Alamat Pabrikan</label>
                                        <textarea className='form-control' name="AlamatPabrikan" value={this.state.AlamatPabrikan} onChange={(e) => this.setState({ AlamatPabrikan: e.target.value })} required disabled={this.state.IsPabrikan == false ? true : false} />
                                        <div className='invalid-feedback'>Silahkan isi alamat pabrikan</div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Nama Penanggung Jawab</label>
                                                <input className='form-control' name="NamaPenanggungJawab" value={this.state.NamaPenanggungJawab} onChange={(e) => this.setState({ NamaPenanggungJawab: e.target.value })} required disabled={this.state.IsPabrikan == false ? true : false} />
                                                <div className='invalid-feedback'>Silahkan isi nama penanggung jawab</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className='form-group mb-2'>
                                                <label>Nomer HP / WA Penanggung Jawab</label>
                                                <input className='form-control' name="NoHPPenanggungJawab" value={this.state.NoHPPenanggungJawab} onChange={(e) => this.setState({ NoHPPenanggungJawab: e.target.value })} required disabled={this.state.IsPabrikan == false ? true : false} />
                                                <div className='invalid-feedback'>Silahkan isi nomer HP / WA penanggung jawab</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='form-group mb-2'>
                                        <label>Upload Surat Dukungan Pabrikan (Tidak Wajib)</label>
                                        <input type="file" className='form-control' name="SuratDukunganPabrikan" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id='btnTutupFormReq'>Batal</button>
                                    <button type="submit" className="btn btn-primary"><i className='fas fa-save'></i> Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalTrans" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Data Transaksi</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Tanggal</th>
                                            <th>Nomor</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.DataTrans.map((tr, i) => {
                                                return (<tr key={i} onClick={() => this.handlePilihTrans(tr)}>
                                                    <td>{tanggalIndo(tr.DocDate)}</td>
                                                    <td>{tr.DocNumber}</td>
                                                    <td>{tr.TransStatus}</td>
                                                </tr>)
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id='btnTutupModalTrans' className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalDetailTrans" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Detail Trans</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <table className='table table-striped'>
                                    <tbody>
                                        <tr>
                                            <td colSpan="3" className="text-center"><strong>DATA PELANGGAN</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Nama Perusahaan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NamaPerusahaan")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Pemohon</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NamaPemohon")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>No HP</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NoHP")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Jabatan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "Jabatan")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Alamat</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "Alamat")?.val || "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className='table table-striped'>
                                    <tbody>
                                        <tr>
                                            <td colSpan="3" className="text-center"><strong>DATA DINAS PEMBERI PEKERJAAN</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Nama Dinas (Pemberi Pekerjaan)</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NamaDinas")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Alamat Dinas</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "AlamatDinas")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Perwakilan Dinas</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NamaPerwakilan")?.val || "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className='table table-striped'>
                                    <tbody>
                                        <tr>
                                            <td colSpan="3" className="text-center"><strong>DETAIL PAKET</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Kode Paket</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "KodePaket")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Paket</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NamaPaket")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Lokasi Paket</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "LokasiPaket")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Volume Pekerjaan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "VolumePekerjaan")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Panjang Jalan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "PanjangJalan")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Lebar Jalan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "LebarJalan")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Kontrak SPK</td>
                                            <td>:</td>
                                            <td>
                                                {this.state.DetailTrans.find(item => item.obj === "KontrakSPK")?.val ?
                                                    <img src={`${this.state.host}/${this.state.DetailTrans.find(item => item.obj === "KontrakSPK").val}`} width="100%" alt="KontrakSPK" /> :
                                                    "Tidak ada gambar"
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>RAB</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "R A B")?.val || "Tidak ada gambar"}</td>
                                        </tr>
                                        <tr>
                                            <td>Gambar Kerja</td>
                                            <td>:</td>
                                            <td>
                                                {this.state.DetailTrans.find(item => item.obj === "GambarKerja")?.val ?
                                                    <img src={`${this.state.host}/${this.state.DetailTrans.find(item => item.obj === "GambarKerja").val}`} width="100%" alt="GambarKerja" /> :
                                                    "Tidak ada gambar"
                                                }
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>MC 0</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "MC0")?.val ?
                                                    <img src={`${this.state.host}/${this.state.DetailTrans.find(item => item.obj === "MC0").val}`} width="100%" alt="MC0" /> :
                                                    "Tidak ada gambar"
                                                }</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className='table table-striped'>
                                    <tbody>
                                        <tr>
                                            <td colSpan="3" className="text-center"><strong>DATA PABRIKAN PENDUKUNG</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Nama Pabrikan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NamaPabrikan")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Alamat Pabrikan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "AlamatPabrikan")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Penanggung Jawab</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NamaPenanggungJawab")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>No HP Penanggung Jawab</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "NoHPPenanggungJawab")?.val || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>Surat Dukungan Pabrikan</td>
                                            <td>:</td>
                                            <td>{this.state.DetailTrans.find(item => item.obj === "SuratDukunganPabrikan")?.val ?
                                                    <img src={`${this.state.host}/${this.state.DetailTrans.find(item => item.obj === "SuratDukunganPabrikan").val}`} width="100%" alt="SuratDukunganPabrikan" /> :
                                                    "Tidak ada gambar"
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id='btnTutupModalTrans' className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalJadwalKunjungan" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Data Jadwal Kunjungan</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Tanggal</th>
                                            <th>Keterangan</th>
                                            <th>Nama Personil</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.DataKunjungan.map((tr, i) => {
                                                return (<tr key={i} onClick={() => this.handlePilihTrans(tr)}>
                                                    <td>{tanggalIndo(tr.Tanggal)}</td>
                                                    <td>{tr.Notes}</td>
                                                    <td>{tr.Nama}</td>
                                                    <td>{tr.Status}</td>
                                                </tr>)
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id='btnTutupModalTrans' className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Home;