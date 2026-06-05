import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getDriverList,
  addDriver,
  updateDriver,
  deleteDriver
} from '../services/api';

const Driver = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDriverList();
      setList(data);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDriver(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        await updateDriver({ ...editingItem, ...values });
        message.success('更新成功');
      } else {
        await addDriver({
          ...values,
          status: 'AVAILABLE',
        });
        message.success('添加成功');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error(editingItem ? '更新失败' : '添加失败');
    }
  };

  const statusMap = {
    AVAILABLE: { color: 'green', text: '可用' },
    BUSY: { color: 'blue', text: '作业中' },
    LEAVE: { color: 'orange', text: '休假' },
  };

  const columns = [
    {
      title: '司机姓名',
      dataIndex: 'driverName',
      key: 'driverName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
    },
    {
      title: '驾照类型',
      dataIndex: 'licenseType',
      key: 'licenseType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const cfg = statusMap[status] || { color: 'gray', text: status };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>司机管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加司机
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingItem ? '编辑司机' : '添加司机'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="driverName"
            label="司机姓名"
            rules={[{ required: true, message: '请输入司机姓名' }]}
          >
            <Input placeholder="请输入司机姓名" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="idCard"
            label="身份证号"
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>

          <Form.Item
            name="licenseType"
            label="驾照类型"
            rules={[{ required: true, message: '请选择驾照类型' }]}
          >
            <Select placeholder="请选择驾照类型">
              <Select.Option value="G1">G1</Select.Option>
              <Select.Option value="G2">G2</Select.Option>
              <Select.Option value="H">H</Select.Option>
              <Select.Option value="K">K</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Driver;
