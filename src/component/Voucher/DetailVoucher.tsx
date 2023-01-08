import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { changeAction, createVoucher, getDetail, getProduct, updateVoucher } from "../../pages/Voucher/voucher.reducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  DATE_FORMAT_TYPE_DDMMYYYY,
} from "../../utils/contants";
import TextArea from "antd/es/input/TextArea";
import { path } from "../../router/path";
import SelectCommon from "../../utils/SelectCommon";
import { filterSelectOption, STATUS, TYPEVOUCHER,TYPE } from "../../utils/filterOptions";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Toast } from "react-toastify/dist/components";

const DetailVoucher = () => {
  const validateMessages = {
    // eslint-disable-next-line
    required: "${label} không được để trống",
  };
  const [form] = Form.useForm();
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { action, dataProduct } = useAppSelector(
    (state) => state.voucherReducer
  );
  const nagivate = useNavigate();
  useEffect(() => {
    Promise.all([
      dispatch(getProduct()),
    ]);
  }, [dispatch]);
  useEffect(() => {
    if (pathname.includes("detail")) {
      dispatch(changeAction("view"));
    }
    if (pathname.includes("update")) {
      dispatch(changeAction("update"));
    }
    if(pathname.includes("add")){
      dispatch(changeAction("add"))
    }
  }, [pathname, dispatch]);
  useEffect(() => {
    if (!id) return;
    dispatch(getDetail(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const resPayload: any = res.payload;
        console.log('ád',resPayload.data.data)
        const arrProductsId = resPayload.data.data.products.map((item:any) => item.id)
        form.setFieldsValue({
          ...resPayload.data.data,
          expiredDate: resPayload.data.data.expiredDate ? dayjs(resPayload.data.data.expiredDate) : null,
          productId: arrProductsId
        });
      }
    });
  }, [id, dispatch, form]);
  const handleSubmit = (data: any) => {
    if (pathname.includes("update")) {
      dispatch(updateVoucher({...data, voucherId: id })).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          toast("Cập nhật thành công")
          nagivate(path.voucher);
        }
      })
    }
    else{
      dispatch(createVoucher(data)).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          console.log('hello')
          nagivate(path.voucher);
        }
      })
    }
  };

  const handleCancel=()=>{
    nagivate(path.voucher);
  }
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        validateMessages={validateMessages}
        onFinish={handleSubmit}
      >
        <Row gutter={10}>
          <Col span={8}>
            <Form.Item
              name="code"
              label="Mã khuyến mãi"
              rules={[
                {
                  required: action === "update"||action==="add",
                },
              ]}
            >
              <Input
                placeholder="Mã khuyến mại"
                onBlur={(e) =>
                  form.setFieldValue("code", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="typeVoucher"
              label="Loại khuyễn mãi"
              rules={[
                {
                  required: action === "update"||action==="add",
                },
              ]}
            >
              <SelectCommon options={TYPEVOUCHER} disabled={action === "view"}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="Loại giảm giá"
            >
              <SelectCommon options={TYPE} disabled={action === "view"}/>
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item
              name="expiredDate"
              label="Ngày hiệu lực"
              rules={[
                {
                  required: action === "update"||action==="add",
                },
              ]}
            >
              <DatePicker
                placeholder="Ngày hiệu lực"
                format={DATE_FORMAT_TYPE_DDMMYYYY}
                allowClear
                className="date-picker"
              />
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item
              name="discountPrice"
              label="Giá giảm áp dụng"
            >
              <Input
                placeholder="Giá giảm áp dụng"
                onBlur={(e) =>
                  form.setFieldValue("discountPrice", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[
                {
                  required: action === "update"||action==="add",
                },
              ]}
            >
              <SelectCommon options={STATUS} filterOption={filterSelectOption} allowClear/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="productId"
              label="Sản phẩm áp dụng"
            >
              <SelectCommon mode='multiple' maxTagCount = 'responsive' options={dataProduct} filterOption={filterSelectOption} allowClear/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: action === "update",
                },
              ]}
            >
              <TextArea
                rows={4}
                maxLength={250}
                placeholder="Description"
                onBlur={(e) =>
                  form.setFieldValue("description", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          {(action === "update" ||action==="add")? (
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Form.Item>
                <Button className="search" htmlType="submit">
                  Lưu
                </Button>
                <Button onClick={handleCancel} className="delete">Hủy</Button>
              </Form.Item>
            </Col>
          ):null}
        </Row>
      </Form>
    </div>
  );
};

export default DetailVoucher;
