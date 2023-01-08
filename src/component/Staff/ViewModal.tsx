import { Button, Col, DatePicker, Form, Input, Modal, Radio, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import moment from "moment";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { IFormColumnsStaff, IFormSearchStaff } from "../../model/Staff.model";
import { IFormPropsModal } from "../../model/utils";
import { addNewUser, getUser, updateUser } from "../../pages/Staff/staff.reducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CommonFormItem from "../../utils/CommonFormItem";
import {
  DATE_FORMAT_TYPE_DDMMYYYY,
  DATE_FORMAT_TYPE_YYYYMMDD,
} from "../../utils/contants";
import { STATUS } from "../../utils/filterOptions";
import SelectCommon from "../../utils/SelectCommon";

const ViewModal = ({
  isOpen,
  setIsOpen,
  valueDetail,
  valueSearch,
}: IFormPropsModal<IFormColumnsStaff, IFormSearchStaff>) => {
  const validateMessages = {
    // eslint-disable-next-line
    required: "${label} không được để trống",
  };
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { action, dataRole, isLoading } = useAppSelector((state) => state.staffReducer);
  const setTitle = () => {
    if (action === "view") {
      return "Xem chi tiết";
    }
    if (action === "update") {
      return "Cập nhật người dùng";
    }
    if (action === 'addnew') {
      return 'Thêm mới người dùng'
    }
  };
  useEffect(() => {
    if (valueDetail && Object.keys(valueDetail).length && isOpen) {
      form.setFieldsValue({
        ...valueDetail,
        birthday: valueDetail.birthday
          ? moment(valueDetail.birthday, DATE_FORMAT_TYPE_YYYYMMDD)
          : null,
      });
    }
  }, [valueDetail, form, isOpen]);
  const handleSubmit = (data: any) => {
    if (action === 'addnew') {
      dispatch(addNewUser(data)).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          setIsOpen(false);
          toast("Thêm người dùng thành công")
          dispatch(getUser(valueSearch));
        }
      })
      return
    }
    dispatch(updateUser({ ...data, userId: valueDetail?.userId })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setIsOpen(false);
          dispatch(getUser(valueSearch));
        }
      }
    );
  };
  const validateDay = (_: any, value: any) => {
    const toDay = new Date().getTime();
    const getTime = new Date(value).getTime();
    if (!value) {
      return Promise.resolve();
    }
    if (getTime > toDay) {
      return Promise.reject("Ngày sinh nhật không thể lớn hơn ngày hiện tại");
    }
    return Promise.resolve();
  };
  return (
    <Modal
      open={isOpen}
      title={setTitle()}
      onCancel={() => setIsOpen(false)}
      afterClose={() => form.resetFields()}
      footer={
        <>
          <Button className="delete" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          {action !== "view" ? (
            <Button loading={isLoading} className="search" onClick={() => form.submit()}>
              Đồng ý
            </Button>
          ) : null}
        </>
      }
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
        validateMessages={validateMessages}
      >
        <Row>
          <Col span={24}>
            <CommonFormItem label="Tên đăng nhập" name="username" max={12} min={4}>
              <Input
                placeholder="Tên đăng nhập"
                onBlur={(e) =>
                  form.setFieldValue("username", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </CommonFormItem>
          </Col>
          <Col span={24}>
            <CommonFormItem label="Họ và tên" name="fullName" isName={true}>
              <Input
                placeholder="Họ và tên"
                onBlur={(e) =>
                  form.setFieldValue("fullName", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </CommonFormItem>
          </Col>
          <Col span={24}>
            <CommonFormItem
              name="phone"
              label="Số điện thoại"
              isRequired
            >
              <Input
                placeholder="Số điện thoại"
                type="number"
                disabled={action === "view"}
              />
            </CommonFormItem>
          </Col>
          <Col span={24}>
            <CommonFormItem
              isEmail={true}
              name="email"
              label="Email"
              isRequired
            >
              <Input
                placeholder="Nhập email của bạn"
                onBlur={(e) =>
                  form.setFieldValue("email", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </CommonFormItem>
          </Col>
          {action === 'addnew' ? <Col span={24}>
            <Form.Item name='password' label='Mật khẩu'>
              <Input
                placeholder="Mật khẩu"
              />
            </Form.Item>
          </Col> : null}
          {action !== 'addnew' ? <Col span={24}>
            <Form.Item name='status' label='Trạng thái'>
              <SelectCommon placeholder='Trạng thái' options={STATUS} disabled={action === 'view'} />
            </Form.Item>
          </Col> : null}
          <Col span={24}>
            <Form.Item
              name="birthday"
              label="Sinh nhật"
              rules={[
                { required: true },
                {
                  validator: validateDay,
                },
              ]}
            >
              <DatePicker
                format={DATE_FORMAT_TYPE_DDMMYYYY}
                placeholder="Sinh nhật"
                className="date-picker"
                disabled={action === "view"}
              />
            </Form.Item>
            <Col>
              <Form.Item name='roleId' label='Quyền'>
                <SelectCommon placeholder="Quyền" options={dataRole} disabled={action === 'view'} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='gender' label='Giới tính'>
                <Radio.Group>
                  <Radio value={0}>Nam</Radio>
                  <Radio value={1}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ViewModal;
