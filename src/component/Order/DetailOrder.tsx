import { Col, Row } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDetailOrder } from "../../pages/Order/order.reducer";
import "../../pages/Order/order.scss"
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const DetailOrder = () => {
    const params = useParams<{ orderId: string }>()
    const dispatch = useAppDispatch()
    const { dataDetailOrder } = useAppSelector(state => state.orderReducer)
    useEffect(() => {
        dispatch(getDetailOrder(params?.orderId))
    }, [params])
    const columns: ColumnsType<any> = [
        {
            title: <span className="title-table">Tên sản phẩm</span>,
            dataIndex: "name",
        },
        {
            title: <span className="title-table">Danh mục</span>,
            dataIndex: "productType",
            render: (value) => <span>{value?.name}</span>
        },
        {
            title: <span className="title-table">Số lượng</span>,
            dataIndex: "totalQuantity",
        },
        {
            title: <span className="title-table">Giá</span>,
            dataIndex: "price",
        },
        {
            title: <span className="title-table">Thành tiền</span>,
            dataIndex: "totalPrice",
        },
    ];
    console.log("data detail order", dataDetailOrder);
    return (
        <div
            style={{ background: "#F8F8FD", borderRadius: "3px", padding: "30px" }}
        >
            <div>
                <p>Chi tiết đơn hàng</p>
                <div className="payment-method title-order">
                    <div>
                        <span>Phương thức thanh toán</span>
                    </div>
                    <div>
                        <div>
                            <span>OrderId: 1#</span>
                            <span>Phương thức thanh toán: {dataDetailOrder?.payment?.paymentMethod}</span>
                        </div>
                        <div>
                            <span>Ngày đặt hàng: {dataDetailOrder?.order?.orderDate ? moment(dataDetailOrder?.order?.orderDate).format('DD/MM/YYYY HH:MM:ss') : ''}</span>
                            <span>Phương thức giao hàng: {dataDetailOrder?.shipment?.shippingMethod}</span>
                        </div>
                    </div>
                </div>
                <div className="delivery-address title-order">
                    <div>
                        <span>Địa chỉ giao hàng</span>
                    </div>
                    <div>
                        <p>Tỉnh/Thành phố: {dataDetailOrder?.addressDTO?.provinceName}</p>
                        <p>Quận/Huyện: {dataDetailOrder?.addressDTO?.districtName}</p>
                        <p>Xã phường/Thị trấn: {dataDetailOrder?.addressDTO?.wardName}</p>
                        <p>Số nhà: số nhà ABC đường CDE</p>
                    </div>
                </div>
                <div className="list-order">
                    <div>
                        <Table columns={columns} dataSource={dataDetailOrder?.productDTOS} />
                    </div>

                </div>
                <div className="order-history title-order">
                    <div>
                        <span>Lịch sử đặt hàng</span>
                    </div>
                    <Row>
                        <Col span={12}>
                            <span>Ngày đặt hàng: {dataDetailOrder?.order?.orderDate ? moment(dataDetailOrder?.order?.orderDate).format('DD/MM/YYYY HH:MM:ss') : ''}</span>
                        </Col>
                        <Col span={12}>

                            <span>Trạng thái:   {dataDetailOrder?.order?.status === 0 ? <span>Đang chờ</span> : ''}
                                {dataDetailOrder?.order?.status === 1 ? <span>Chấp nhận</span> : ''}
                                {dataDetailOrder?.order?.status !== 0 && dataDetailOrder?.order?.status !== 1 ? <span>Đã huỷ</span> : ''}</span>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default DetailOrder;
