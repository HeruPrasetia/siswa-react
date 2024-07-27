import React, { Fragment } from 'react';
import { api, tanggalIndo, numberFormat } from '../Module';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            Detail: {}
        };
    }

    async componentDidMount() {
        // this.handleMain();
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
                    <h5 style={{ textAlign: "center" }}>Informasi</h5>
                    <h5>Menu masih dalam pengembangan</h5>
                </div>
            </Fragment>
        )
    }
}

export default Home;