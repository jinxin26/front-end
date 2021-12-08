import './App.css';
import React, {Component} from "react";
import {Modal, Table} from "antd";
import axios from "axios";

class App extends Component {
    state = {
        orders: [],
        pagination: {
            pageNumber: 1,
            pageSize: 10
        },
        sortField: undefined,
        sortRule: undefined,
        orderStatus: undefined,
        totalOrders: 0,
        orderId: '',
        status: '',
        totalPrice: '',
        visible: false
    }

    async componentDidMount() {
        await this.getAllData({});
    }

    createAnOrder = async () => {
        console.log('clicked')
        const order = {
            'products': [
                {
                    'productName': 'YangZhiGanLu',
                    'sugar': 'all',
                    'heat': 'hot'
                },
                {
                    'productName': 'SiJiNaiLv',
                    'sugar': 'all',
                    'heat': 'cold'
                }
            ]
        }

        await axios.post('/order_info', order).then(res => res.data);
        // await this.getAllData();
    }

    getAllData = async (params) => {
        const data = await axios.post(`/order_info/page`, params).then(res => res.data);

        const pagination = { ...this.state.pagination };
        this.setState({
            orders: data.content,
            totalOrders: data.totalElements,
        });
        pagination.total = this.state.totalOrders;
        this.setState({ pagination })

        console.log(data)
    }

    handleTableChange = async (pagination, filters, sorter) => {
        console.log('sorter', sorter)
        const page = { ...this.state.pagination };
        const currentStatus = {...filters}.orderStatus == null ? ['Submitted', 'Completed'] : {...filters}.orderStatus;
        console.log(currentStatus)
        page.current = pagination.current;
        this.setState({
            pagination: page,
            pageNumber: page.current,
            sortRule: sorter.order,
            sortField: sorter.field,
            orderStatus: currentStatus
        })

        const params = {
            pageNumber: pagination.current,
            pageSize: pagination.pageSize,
            sortField: sorter.field,
            sortRule: sorter.order,
            orderStatus: currentStatus
        };
        await this.getAllData(params);
    }

    onUpdate = async (record) => {
        axios.put(`/order_info/${record.orderId}/update`).then(res => res.data);
        // await this.getAllData();
    }

    onDelete = async (record) => {
        axios.delete(`/order_info/${record.orderId}/delete`).then(res => res.data);
        // await this.getAllData();
    }

    showModal = () => {
        this.setState({
            visible: true
        })
    }

    handleOk = () => {
        console.log('OK')
        this.setState({
            visible: false
        })
        console.log(this.state.visible)
    }

    handleCancel = () => {
        console.log('Cancel')
        console.log(this.state.visible)
        this.setState({
            visible: false
        })
        console.log(this.state.visible)
    }

    render() {
        const dataSource = this.state.orders.map((order) => {
            return {
                key: order.id,
                orderId: order.orderId,
                status: order.status,
                totalPrice: order.products[0].productName,
            }
        });

        const columns = [
            {
                title: '订单号',
                dataIndex: 'orderId',
                key: 'orderId',
                width: 130,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.orderId - b.orderId,
            },
            {
                title: '订单状态',
                dataIndex: 'status',
                key: 'status',
                width: 130,
                filters: [
                    {
                        text: 'Submitted',
                        value: 'Submitted',
                    },
                    {
                        text: 'Completed',
                        value: 'Completed',
                    }
                ],
                onFilter: (value, record) => record.status.indexOf(value) === 0,
            },
            {
                title: '总金额',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                width: 130
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 160,
                className: 'operates',
                align: 'center',
                render: (text, record) => (
                    <div>
                        <a className="red-button table-operation" onClick={() => this.onUpdate(record)}>更新   </a>
                        <a className="red-button table-operation" onClick={() => this.onDelete(record)}>删除</a>
                    </div>
                )
            }
        ];

        return (
            <div className="App">
                <div>
                    <button onClick={this.createAnOrder}>下单</button>
                    <button onClick={this.showModal}>显示</button>
                    <Modal title="Basic Modal" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}/>
                </div>
                <div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{
                            ...this.state.pagination,
                            showTotal: total => `总共${total}条 每页10条`
                        }}
                        onChange={this.handleTableChange}
                    />
                </div>
            </div>
        );
    }

}

export default App;
