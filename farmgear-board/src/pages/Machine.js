import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, message,
  Space, Tag, Popover, List, Descriptions, Progress
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined,
  HistoryOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getMachineList,
  getMachineTypes,
  addMachine,
  updateMachine,
  deleteMachine,
  getMaintenanceRecords,
  addMaintenanceRecord,
  getMaintenanceInfo
} from '../services/api';

const Machine = () => {
  const [list, setList] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);
  const [form] = Form.useForm();
  const [maintenanceForm] = Form.useForm();

  useEffect(() => {
    loadData();
    loadTypes();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMachineList();
      setList(data);
    } catch (error) {
      console.error('Failed to load machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTypes = async () => {
    try {
      const data = await getMachineTypes();
      setMachineTypes(data);
    } catch (error) {
      console.error('Failed to load machine types:', error);
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
      purchaseDate: record.purchaseDate ? dayjs(record.purchaseDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMachine(id);
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
        purchaseDate: values.purchaseDate?.format('YYYY-MM-DD'),
      };

      if (editingItem) {
        await updateMachine({ ...editingItem, ...data });
        message.success('更新成功');
      } else {
        await addMachine({
          ...data,
          status: 'IDLE',
          totalHours: 0,
          lastMaintenanceHours: 0,
        });
        message.success('添加成功');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error(editingItem ? '更新失败' : '添加失败');
    }
  };

  const handleViewMaintenance = async (record) => {
    setSelectedMachine(record);
    try {
      const [records, info] = await Promise.all([
        getMaintenanceRecords(record.id),
        getMaintenanceInfo(record.id)
      ]);
      setMaintenanceRecords(records);
      setMaintenanceInfo(info);
      setMaintenanceModalVisible(true);
    } catch (error) {
      message.error('获取保养记录失败');
    }
  };

  const handleAddMaintenance = async (values) => {
    try {
      await addMaintenanceRecord({
        ...values,
        machineId: selectedMachine.id,
        maintenanceDate: values.maintenanceDate.format('YYYY-MM-DD'),
        currentHours: maintenanceInfo?.totalHours || 0,
      });
      message.success('记录成功');
      maintenanceForm.resetFields();
      const [records, info] = await Promise.all([
        getMaintenanceRecords(selectedMachine.id),
        getMaintenanceInfo(selectedMachine.id)
      ]);
      setMaintenanceRecords(records);
      setMaintenanceInfo(info);
      loadData();
    } catch (error) {
      message.error('记录失败');
    }
  };

  const getMaintenanceProgress = (info) => {
    if (!info || info.maintenanceCycleHours === 0) return 0;
    const progress = (info.hoursSinceLastMaintenance / info.maintenanceCycleHours) * 100;
    return Math.min(progress, 100);
  };

  const getMaintenanceStatusColor = (status) => {
    switch (status) {
      case 'OVERDUE': return '#ff4d4f';
      case 'WARNING': return '#faad14';
      default: return '#52c41a';
    }
  };

  const statusMap = {
    IDLE: { color: 'green', text: '空闲' },
    WORKING: { color: 'blue', text: '作业中' },
    MAINTENANCE: { color: 'orange', text: '保养中' },
    BROKEN: { color: 'red', text: '故障' },
  };

  const columns = [
    {
      title: '农机编号',
      dataIndex: 'machineNo',
      key: 'machineNo',
    },
    {
      title: '农机名称',
      dataIndex: 'machineName',
      key: 'machineName',
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '累计工时',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (val) => `${val || 0}小时`,
    },
    {
      title: '保养周期',
      dataIndex: 'maintenanceCycleHours',
      key: 'maintenanceCycleHours',
      render: (val) => val ? `${val}小时` : '-',
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
      title: '保养状态',
      key: 'maintenance',
      render: (_, record) => {
        return (
          <Popover
            content={
              <Button
                type="link"
                size="small"
                icon={<HistoryOutlined />}
                onClick={() => handleViewMaintenance(record)}
              >
                查看详情
              </Button>
            }
            title="保养提醒"
            trigger="hover"
          >
            <Tag icon={<InfoCircleOutlined />} color="blue">
              {record.maintenanceCycleHours ?
                `${record.maintenanceCycleHours - (record.totalHours - (record.lastMaintenanceHours || 0))}小时后需保养` :
                '未设置'
              }
            </Tag>
          </Popover>
        );
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
            icon={<ToolOutlined />}
            onClick={() => handleViewMaintenance(record)}
          >
            保养
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
        <h2>农机档案管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加农机
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
        title={editingItem ? '编辑农机' : '添加农机'}
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
            name="machineNo"
            label="农机编号"
            rules={[{ required: true, message: '请输入农机编号' }]}
          >
            <Input placeholder="请输入农机编号" />
          </Form.Item>

          <Form.Item
            name="machineName"
            label="农机名称"
            rules={[{ required: true, message: '请输入农机名称' }]}
          >
            <Input placeholder="请输入农机名称" />
          </Form.Item>

          <Form.Item
            name="typeId"
            label="农机类型"
            rules={[{ required: true, message: '请选择农机类型' }]}
          >
            <Select placeholder="请选择农机类型">
              {machineTypes.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.typeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="brand"
            label="品牌"
          >
            <Input placeholder="请输入品牌" />
          </Form.Item>

          <Form.Item
            name="model"
            label="型号"
          >
            <Input placeholder="请输入型号" />
          </Form.Item>

          <Form.Item
            name="purchaseDate"
            label="购买日期"
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择购买日期" />
          </Form.Item>

          <Form.Item
            name="maintenanceCycleHours"
            label="保养周期(小时)"
            rules={[{ required: true, message: '请输入保养周期' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="请输入保养周期"
              addonAfter="小时"
            />
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

      <Modal
        title={`${selectedMachine?.machineName} - 保养记录`}
        open={maintenanceModalVisible}
        onCancel={() => setMaintenanceModalVisible(false)}
        width={700}
        footer={null}
      >
        {maintenanceInfo && (
          <div style={{ marginBottom: 16 }}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="当前工时">{maintenanceInfo.totalHours}小时</Descriptions.Item>
              <Descriptions.Item label="保养周期">{maintenanceInfo.maintenanceCycleHours}小时</Descriptions.Item>
              <Descriptions.Item label="上次保养工时">{maintenanceInfo.lastMaintenanceHours}小时</Descriptions.Item>
              <Descriptions.Item label="距上次保养">{maintenanceInfo.hoursSinceLastMaintenance}小时</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>保养进度</span>
                <span style={{ color: getMaintenanceStatusColor(maintenanceInfo.maintenanceStatus) }}>
                  {maintenanceInfo.maintenanceStatus === 'OVERDUE' ? '已超期' :
                    maintenanceInfo.maintenanceStatus === 'WARNING' ? '即将到期' : '正常'}
                </span>
              </div>
              <Progress
                percent={Math.round(getMaintenanceProgress(maintenanceInfo))}
                strokeColor={getMaintenanceStatusColor(maintenanceInfo.maintenanceStatus)}
              />
            </div>
          </div>
        )}

        <Form
          form={maintenanceForm}
          layout="inline"
          onFinish={handleAddMaintenance}
          style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}
        >
          <Form.Item
            name="maintenanceDate"
            label="保养日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker placeholder="选择日期" />
          </Form.Item>
          <Form.Item
            name="maintenanceType"
            label="保养类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="类型" style={{ width: 120 }}>
              <Select.Option value="REGULAR">常规保养</Select.Option>
              <Select.Option value="REPAIR">维修</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input placeholder="保养描述" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            name="cost"
            label="费用"
          >
            <InputNumber placeholder="费用" prefix="¥" style={{ width: 100 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              记录
            </Button>
          </Form.Item>
        </Form>

        <List
          header={<div>历史记录</div>}
          bordered
          dataSource={maintenanceRecords}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color={item.maintenanceType === 'REPAIR' ? 'red' : 'blue'}>
                      {item.maintenanceType === 'REPAIR' ? '维修' : '常规保养'}
                    </Tag>
                    <span>{item.maintenanceDate}</span>
                  </Space>
                }
                description={
                  <div>
                    <div>{item.description || '无描述'}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>
                      当前工时: {item.currentHours}小时
                      {item.cost && ` | 费用: ¥${item.cost}`}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Machine;
