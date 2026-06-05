import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getWorkRequirementList,
  getWorkItemList,
  submitWorkRequirement,
  updateWorkRequirement,
  deleteWorkRequirement
} from '../services/api';

const WorkRequirement = () => {
  const [list, setList] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
    loadWorkItems();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getWorkRequirementList();
      setList(data);
    } catch (error) {
      console.error('Failed to load requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkItems = async () => {
    try {
      const data = await getWorkItemList();
      setWorkItems(data);
    } catch (error) {
      console.error('Failed to load work items:', error);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      expectedDate: record.expectedDate ? dayjs(record.expectedDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkRequirement(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        expectedDate: values.expectedDate.format('YYYY-MM-DD'),
      };

      if (editingItem) {
        await updateWorkRequirement({ ...editingItem, ...data });
        message.success('更新成功');
      } else {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        await submitWorkRequirement({
          ...data,
          farmerId: userInfo.userId || 1,
          farmerName: userInfo.realName || '农户',
          phone: userInfo.phone || '',
        });
        message.success('提交成功');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error(editingItem ? '更新失败' : '提交失败');
    }
  };

  const statusMap = {
    PENDING: { color: 'orange', text: '待调度' },
    ASSIGNED: { color: 'blue', text: '已安排' },
    COMPLETED: { color: 'green', text: '已完成' },
    CANCELLED: { color: 'gray', text: '已取消' },
  };

  const columns = [
    {
      title: '农户姓名',
      dataIndex: 'farmerName',
      key: 'farmerName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '村庄',
      dataIndex: 'village',
      key: 'village',
    },
    {
      title: '地块位置',
      dataIndex: 'plotLocation',
      key: 'plotLocation',
    },
    {
      title: '作业项目',
      dataIndex: 'workItemName',
      key: 'workItemName',
    },
    {
      title: '亩数',
      dataIndex: 'acreage',
      key: 'acreage',
      render: (val) => `${val}亩`,
    },
    {
      title: '期望日期',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
            disabled={record.status !== 'PENDING'}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.status !== 'PENDING'}
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
        <h2>作业需求管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          登记需求
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
        title={editingItem ? '编辑作业需求' : '登记作业需求'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="farmerName"
            label="农户姓名"
            rules={[{ required: true, message: '请输入农户姓名' }]}
          >
            <Input placeholder="请输入农户姓名" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="village"
            label="村庄"
          >
            <Input placeholder="请输入村庄名称" />
          </Form.Item>

          <Form.Item
            name="plotLocation"
            label="地块位置描述"
            rules={[{ required: true, message: '请输入地块位置描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请描述地块具体位置" />
          </Form.Item>

          <Form.Item
            name="workItemId"
            label="作业项目"
            rules={[{ required: true, message: '请选择作业项目' }]}
          >
            <Select placeholder="请选择作业项目">
              {workItems.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.itemName} ({item.unitPrice}元/亩)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="acreage"
            label="预计亩数"
            rules={[{ required: true, message: '请输入预计亩数' }]}
          >
            <InputNumber
              min={0.1}
              step={0.1}
              style={{ width: '100%' }}
              placeholder="请输入预计亩数"
              addonAfter="亩"
            />
          </Form.Item>

          <Form.Item
            name="expectedDate"
            label="期望作业日期"
            rules={[{ required: true, message: '请选择期望日期' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="请选择期望作业日期"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? '更新' : '提交'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkRequirement;
