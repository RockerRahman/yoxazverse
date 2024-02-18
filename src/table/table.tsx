import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Card,
  Typography,
  Select,
  Row,
  Col,
  Pagination,
  InputNumber,
} from "antd";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiEdit, FiTrash } from "react-icons/fi";
import { DoubleRightOutlined, SearchOutlined } from "@ant-design/icons";
import { onlyNumber } from "../validation/validation";
import moment from "moment/moment";
import styled from "styled-components";

interface UserData {
  id: string;
  shpiify: string;
  date: string;
  status: string;
  customer: string;
  email: string;
  country: string;
  shipping: string;
  source: string;
  ordertype: string;
}

const MyTable: React.FC = () => {
  const [form] = Form.useForm(); // This will Initialize form
  const [tabledata, setTableData] = useState<UserData[]>([]);
  const [selectedRows, setSelectedRows] = useState<UserData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [expand, setExpand] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<any>({
    keyword: "",
    status: "Pending",
  });
  const [filteredData, setFilteredData] = useState<UserData[]>([]);

  // this is the function to handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    setFilteredData(tabledata);
  }, [tabledata]);

  useEffect(() => {
    const localData = localStorage.getItem("tabledata");
    if (localData) {
      setTableData(JSON.parse(localData));
    }
  }, []);

  // to save data to localStorage
  const saveDataToLocalStorage = (data: UserData[]) => {
    localStorage.setItem("tabledata", JSON.stringify(data));
  };
  const handleEditClick = (record: UserData) => {
    console.log(record);

    setVisible(true);
    form.setFieldsValue({
      ...record,
      date: moment(record.date).format("DD-MM-YYYY"),
    });
    setEditKey(record.id);
  };

  const handleEditCancel = () => {
    setVisible(false);
    form.resetFields();
    setEditKey(null);
  };

  // to filter table data for search
  const filterTableData = (criteria: any) => {
    const { keyword, status } = criteria;
    let filteredData = [...tabledata];

    if (keyword) {
      const lowercaseKeyword = keyword.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.shpiify.toString().includes(lowercaseKeyword) ||
          item.customer.toLowerCase().includes(lowercaseKeyword) ||
          item.email.toLowerCase().includes(lowercaseKeyword) ||
          item.country.toLowerCase().includes(lowercaseKeyword) ||
          item.shipping.toLowerCase().includes(lowercaseKeyword) ||
          item.source.toLowerCase().includes(lowercaseKeyword) ||
          item.ordertype.toLowerCase().includes(lowercaseKeyword)
      );
    }

    if (status && status !== "All") {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    return filteredData;
  };

  // search function
  const handleSearch = () => {
    const filteredData = filterTableData(searchCriteria);
    setFilteredData(filteredData);
  };

  const handleReset = () => {
    setSearchCriteria({ keyword: "", status: "Pending" });
    setFilteredData(tabledata);
  };

  //to set form before collapse
  const generateField = () => (
    <Col>
      <Form layout="inline" colon={false}>
        <Col>
          <Form.Item style={{ textAlign: "left" }}>
            <Typography style={{ fontWeight: "bold" }}>
              What are you looking for?
            </Typography>
          </Form.Item>
          <Form.Item style={{ width: "400px" }}>
            <Input
              value={searchCriteria.keyword}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  keyword: e.target.value,
                })
              }
              prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
              placeholder="Search for category, name, company ,etc"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Typography style={{ fontWeight: "bold", textAlign: "left" }}>
              Category
            </Typography>
          </Form.Item>
          <Form.Item style={{ minWidth: "120px" }}>
            <Select defaultValue="All"></Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Typography style={{ fontWeight: "bold", textAlign: "left" }}>
              Status
            </Typography>
          </Form.Item>
          <Form.Item name="status" style={{ minWidth: "120px" }}>
            <Select
              value={searchCriteria.status}
              onChange={(value) =>
                setSearchCriteria({
                  ...searchCriteria,
                  status: value,
                })
              }
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Processed">Processed</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Form.Item>
          <Button
            style={{ marginTop: "32px" }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <DoubleRightOutlined rotate={expand ? 270 : 90} />
          </Button>
        </Form.Item>
        <Form.Item style={{ marginTop: "32px" }}>
          <Button
            type="primary"
            style={{ minWidth: "160px" }}
            onClick={handleSearch}
          >
            SEARCH
          </Button>
        </Form.Item>
        <Form.Item style={{ marginTop: "32px" }}>
          <Button
            type="default"
            style={{ minWidth: "160px" }}
            onClick={handleReset}
          >
            RESET
          </Button>
        </Form.Item>
      </Form>
      {/* form after collapse */}
      {expand && (
        <Form
          style={{ marginTop: "20px", width: "220px" }}
          layout="vertical"
          colon={false}
        >
          <Form.Item name="key" label="Any field" initialValue={undefined}>
            <Select>
              <Select.Option value="2">Value</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      )}
    </Col>
  );

  const getFields = () => {
    return generateField();
  };

  // to handle form submission
  const onFinish = (values: UserData) => {
    const updatedData = editKey
      ? tabledata.map((item) =>
          item.id === editKey ? { ...item, ...values } : item
        )
      : [...tabledata, { ...values, id: Date.now().toString() }];
    setTableData(updatedData);
    saveDataToLocalStorage(updatedData);
    localStorage.setItem("tabledata", JSON.stringify(updatedData));
    form.resetFields();
    setVisible(false);
    setEditKey(null);
  };
  const handleDelete = (id: string) => {
    const updatedData = tabledata.filter((item) => item.id !== id);
    setTableData(updatedData);
    saveDataToLocalStorage(updatedData);
    localStorage.setItem("tabledata", JSON.stringify(updatedData));
  };

  // table data
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "SHPIIFY #",
      dataIndex: "shpiify",
      key: "shpiify",
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      render: (date: Date) => {
        return moment(date).format("DD-MM-YYYY");
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "CUSTOMER",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "SHIPPING",
      dataIndex: "shipping",
      key: "shipping",
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "ORDER TYPE",
      dataIndex: "ordertype",
      key: "ordertype",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: UserData) => {
        const selectedRow = selectedRows.find((row) => row.id === record.id);
        const cursorStyle = selectedRow ? "pointer" : "not-allowed";
        const opacity = selectedRow ? 1 : 0.5;

        const handleClick = () => {
          if (selectedRow) handleEditClick(record);
        };

        const onDelete = () => {
          if (selectedRow) handleDelete(record.id);
        };

        return (
          <Row gutter={20}>
            <Col
              style={{ cursor: cursorStyle, opacity: opacity }}
              onClick={() => handleClick()}
            >
              <FiEdit style={{ fontSize: "18px" }} />
            </Col>
            <Col
              style={{ cursor: cursorStyle, opacity: opacity }}
              onClick={() => onDelete()}
            >
              <FiTrash style={{ fontSize: "18px", color: "red" }} />
            </Col>
          </Row>
        );
      },
    },
  ];

  const showModal = () => {
    setVisible(true);
  };

  return (
    <>
      <div>
        <Row justify="space-between">
          <Typography.Title level={3}>Orders</Typography.Title>
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginTop: "24px" }}
          >
            CREATE NEW
          </Button>
        </Row>
        <Card
          style={{
            marginBottom: "25px",
            boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Form form={form}>{getFields()}</Form>
        </Card>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          style={{
            boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRows.map((row) => row.id),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
          pagination={false}
          title={() => (
            <Form colon={false}>
              <Row gutter={20} justify="space-between">
                <Col>
                  <div
                    style={{
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    Product Summary
                  </div>
                </Col>
                <div style={{ display: "flex" }}>
                  <Col>
                    <Form.Item label="Show">
                      <Select defaultValue="All Column">
                        <Select.Option vallue="All Column">
                          All Column
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item>
                      <Button type="primary">Dispatch Selected</Button>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item>
                      <Pagination showSizeChanger={false} total={100} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
            </Form>
          )}
        />

        {/* to show form inside the add and edit form */}
        <Modal
          title={editKey ? "Edit Details" : "Create New"}
          visible={visible}
          onCancel={handleEditCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="SHPIIFY #" name="shpiify">
                  <InputNumber
                    style={{ width: "100%" }}
                    onKeyPress={onlyNumber}
                    placeholder="Type only number"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Date" name="date">
                  <DatePicker
                    className="ants-date-picker"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd-MM-yyyy"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Status" name="status">
                  <Select>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Processed">Processed</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Customer" name="customer">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Country" name="country">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Shipping" name="shipping">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Source" name="source">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Order Type" name="ordertype">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button type="primary" htmlType="submit">
                  {editKey ? "Save Changes" : "Create"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default MyTable;
