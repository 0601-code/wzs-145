import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Select, DatePicker, message, Space, Tag, Alert
} from 'antd';
import { PlusOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getWorkScheduleList,
  getWorkRequirementList,
  getMachineList,
  getAvailableDrivers,
  checkScheduleConflict,
  createWorkSchedule,
  cancelWorkSchedule,
  deleteWorkSchedule
} from '../services/api';

const WorkSchedule = () => {
  const [list, setList] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [machines, setMachines] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [conflictAlert, setConflictAlert] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedules, reqs, machs, drvs] = await Promise.all([
        getWorkScheduleList(),
        getWorkRequirementList(),
        getMachineList(),
        getAvailableDrivers()
      ]);
      setList(schedules);
      setRequirements(reqs.filter(r => r.status === 'PENDING' || r.status === 'ASSIGNED'));
      setMachines(machs.filter(m => m.status === 'IDLE'));
      setDrivers(drvs);
    } catch (error) {
      console.error('Failed to load schedule data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setConflictAlert(null);
    setModalVisible(true);
  };

  const handleScheduleDateChange = async () => {
    const values = form.getFieldsValue();
    if (values.requirementId && values.machineId && values.driverId && values.scheduleDate) {
      try {
        const result = await checkScheduleConflict({
          requirementId: values.requirementId,
          machineId: values.machineId,
          driverId: values.driverId,
          scheduleDate: values.scheduleDate.format('YYYY-MM-DD')
        });
        if (result.hasConflict) {
          setConflictAlert({
            type: 'error',
            message: '排班冲突',
            description: result.message
          });
        } else {
          setConflictAlert({
            type: 'success',
            message: '无冲突',
            description: '该农机和司机在该日期可用'
          });
        }
      } catch (error) {
        setConflictAlert(null);
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        scheduleDate: values.scheduleDate.format('YYYY-MM-DD'),
      };
      await createWorkSchedule(data);
      message.success('排班成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error(error.message || '排班失败');
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelWorkSchedule(id);
      message.success('取消成功');
      loadData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkSchedule(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const statusMap = {
    SCHEDULED: { color: 'blue', text: '已排班' },
    IN_PROGRESS: { color: 'orange', text: '进行中' },
    COMPLETED: { color: 'green', text: '已完成' },
    CANCELLED: { color: 'gray', text: '已取消' },
  };

  const columns = [
    {
      title: '农户',
      dataIndex: 'farmerName',
      key: 'farmerName',
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
      title: '农机',
      dataIndex: 'machineName',
      key: 'machineName',
    },
    {
      title: '司机',
      dataIndex: 'driverName',
      key: 'driverName',
    },
    {
      title: '排班日期',
      dataIndex: 'scheduleDate',
      key: 'scheduleDate',
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
          {record.status === 'SCHEDULED' && (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => {}}
              >
                开始作业
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancel(record.id)}
              >
                取消
              </Button>
            </>
          )}
          {record.status === 'CANCELLED' && (
            <Button
              type="link"
              danger
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>农机排班管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建排班
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
        title="新建排班"
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
            name="requirementId"
            label="作业需求"
            rules={[{ required: true, message: '请选择作业需求' }]}
          >
            <Select
              placeholder="请选择作业需求"
              onChange={handleScheduleDateChange}
              showSearch
              optionFilterProp="children"
            >
              {requirements.map(req => (
                <Select.Option key={req.id} value={req.id}>
                  {req.farmerName} - {req.workItemName} - {req.acreage}亩
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="machineId"
            label="农机"
            rules={[{ required: true, message: '请选择农机' }]}
          >
            <Select
              placeholder="请选择农机"
              onChange={handleScheduleDateChange}
            >
              {machines.map(m => (
                <Select.Option key={m.id} value={m.id}>
                  {m.machineNo} - {m.machineName} ({m.typeName})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="driverId"
            label="司机"
            rules={[{ required: true, message: '请选择司机' }]}
          >
            <Select
              placeholder="请选择司机"
              onChange={handleScheduleDateChange}
            >
              {drivers.map(d => (
                <Select.Option key={d.id} value={d.id}>
                  {d.driverName} ({d.licenseType})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduleDate"
            label="排班日期"
            rules={[{ required: true, message: '请选择排班日期' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="请选择排班日期"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              onChange={handleScheduleDateChange}
            />
          </Form.Item>

          {conflictAlert && (
            <Alert
              message={conflictAlert.message}
              description={conflictAlert.description}
              type={conflictAlert.type}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确认排班
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkSchedule;
