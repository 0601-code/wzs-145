import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getWorkItemList,
  addWorkItem,
  updateWorkItem,
  deleteWorkItem
} from '../services/api';

const WorkItem = () => {
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
      const data = await getWorkItemList();
      setList(data);
    } catch (error) {
      console.error('Failed to load work items:', error);
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
      await deleteWorkItem(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        await updateWorkItem({ ...editingItem, ...values });
        message.success('更新成功');
      } else {
        await addWorkItem(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error(editingItem ? '更新失败' : '添加失败');
    }
  };

  const columns = [
    {
      title: '作业项目名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '项目代码',
      dataIndex: 'itemCode',
      key: 'itemCode',
    },
    {
      title: '单价(元/亩)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val) => `¥${val}`,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
        <h2>作业项目管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加项目
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
        title={editingItem ? '编辑作业项目' : '添加作业项目'}
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
            name="itemName"
            label="作业项目名称"
            rules={[{ required: true, message: '请输入作业项目名称' }]}
          >
            <Input placeholder="请输入作业项目名称" />
          </Form.Item>

          <Form.Item
            name="itemCode"
            label="项目代码"
            rules={[{ required: true, message: '请输入项目代码' }]}
          >
            <Input placeholder="请输入项目代码" />
          </Form.Item>

          <Form.Item
            name="unitPrice"
            label="单价(元/亩)"
            rules={[{ required: true, message: '请输入单价' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="请输入单价"
              prefix="¥"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入描述" />
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

export default WorkItem;
