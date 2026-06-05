import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Space, Tag, Select, Descriptions
} from 'antd';
import { PlusOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getWorkRecordList,
  getWorkScheduleList,
  getWorkRecordFromSchedule,
  createWorkRecord,
  calculateCost,
  getReceiptByRecord,
  confirmReceipt,
  disputeReceipt
} from '../services/api';

const WorkRecord = () => {
  const [list, setList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [calculatedCost, setCalculatedCost] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [records, schs] = await Promise.all([
        getWorkRecordList(),
        getWorkScheduleList()
      ]);
      setList(records);
      setSchedules(schs.filter(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS'));
    } catch (error) {
      console.error('Failed to load record data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setCalculatedCost(null);
    setModalVisible(true);
  };

  const handleScheduleChange = async (scheduleId) => {
    try {
      const record = await getWorkRecordFromSchedule(scheduleId);
      form.setFieldsValue({
        ...record,
        workDate: record.workDate ? dayjs(record.workDate) : dayjs(),
      });
    } catch (error) {
      console.error('Failed to load schedule data:', error);
    }
  };

  const handleCalculateCost = async () => {
    const values = form.getFieldsValue();
    if (values.scheduleId && values.actualAcreage) {
      try {
        const schedule = schedules.find(s => s.id === values.scheduleId);
        if (schedule) {
          const cost = await calculateCost({
            workItemId: schedule.requirementId,
            acreage: values.actualAcreage,
            fuelConsumption: values.fuelConsumption,
            workHours: values.workHours,
          });
          setCalculatedCost(cost);
          form.setFieldsValue({ totalCost: cost.totalCost });
        }
      } catch (error) {
        message.error('计算费用失败');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        workDate: values.workDate.format('YYYY-MM-DD'),
      };
      await createWorkRecord(data);
      message.success('提交成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('提交失败');
    }
  };

  const handleViewReceipt = async (record) => {
    setCurrentRecord(record);
    try {
      const receipt = await getReceiptByRecord(record.id);
      setCurrentReceipt(receipt);
      setReceiptModalVisible(true);
    } catch (error) {
      message.error('获取回执失败');
    }
  };

  const handleConfirmReceipt = async () => {
    try {
      await confirmReceipt(currentReceipt.id, '已确认');
      message.success('确认成功');
      setReceiptModalVisible(false);
      loadData();
    } catch (error) {
      message.error('确认失败');
    }
  };

  const handleDisputeReceipt = async () => {
    try {
      await disputeReceipt(currentReceipt.id, '对作业质量有异议');
      message.success('已提交异议');
      setReceiptModalVisible(false);
      loadData();
    } catch (error) {
      message.error('提交失败');
    }
  };

  const receiptStatusMap = {
    PENDING: { color: 'orange', text: '待确认' },
    CONFIRMED: { color: 'green', text: '已确认' },
    DISPUTED: { color: 'red', text: '有争议' },
  };

  const columns = [
    {
      title: '农户',
      dataIndex: 'farmerName',
      key: 'farmerName',
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
      title: '作业日期',
      dataIndex: 'workDate',
      key: 'workDate',
    },
    {
      title: '实际亩数',
      dataIndex: 'actualAcreage',
      key: 'actualAcreage',
      render: (val) => val ? `${val}亩` : '-',
    },
    {
      title: '作业工时',
      dataIndex: 'workHours',
      key: 'workHours',
      render: (val) => val ? `${val}小时` : '-',
    },
    {
      title: '油耗',
      dataIndex: 'fuelConsumption',
      key: 'fuelConsumption',
      render: (val) => val ? `${val}升` : '-',
    },
    {
      title: '总费用',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (val) => val ? `¥${val}` : '-',
    },
    {
      title: '异常情况',
      dataIndex: 'exception',
      key: 'exception',
      render: (val) => val ? (
        <Tag color="red" icon={<ExclamationCircleOutlined />}>有异常</Tag>
      ) : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => handleViewReceipt(record)}
          >
            回执
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>作业记录</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          记录作业
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
        title="记录作业"
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
            name="scheduleId"
            label="排班记录"
            rules={[{ required: true, message: '请选择排班记录' }]}
          >
            <Select
              placeholder="请选择排班记录"
              onChange={handleScheduleChange}
            >
              {schedules.map(s => (
                <Select.Option key={s.id} value={s.id}>
                  {s.farmerName} - {s.workItemName} - {s.machineName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="workDate"
            label="作业日期"
            rules={[{ required: true, message: '请选择作业日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择作业日期" />
          </Form.Item>

          <Form.Item
            name="actualAcreage"
            label="实际作业亩数"
            rules={[{ required: true, message: '请输入实际作业亩数' }]}
          >
            <InputNumber
              min={0.1}
              step={0.1}
              style={{ width: '100%' }}
              placeholder="请输入实际作业亩数"
              addonAfter="亩"
              onBlur={handleCalculateCost}
            />
          </Form.Item>

          <Form.Item
            name="workHours"
            label="作业工时"
          >
            <InputNumber
              min={0.1}
              step={0.5}
              style={{ width: '100%' }}
              placeholder="请输入作业工时"
              addonAfter="小时"
              onBlur={handleCalculateCost}
            />
          </Form.Item>

          <Form.Item
            name="fuelConsumption"
            label="油耗"
          >
            <InputNumber
              min={0}
              step={0.1}
              style={{ width: '100%' }}
              placeholder="请输入油耗"
              addonAfter="升"
              onBlur={handleCalculateCost}
            />
          </Form.Item>

          {calculatedCost && (
            <Descriptions bordered size="small" style={{ marginBottom: 16 }} column={1}>
              <Descriptions.Item label="作业费用">¥{calculatedCost.workCost || 0}</Descriptions.Item>
              <Descriptions.Item label="燃油费用">¥{calculatedCost.fuelCost || 0}</Descriptions.Item>
              <Descriptions.Item label="总费用" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                ¥{calculatedCost.totalCost || 0}
              </Descriptions.Item>
            </Descriptions>
          )}

          <Form.Item
            name="totalCost"
            label="总费用"
            rules={[{ required: true, message: '请输入总费用' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="请输入总费用"
              prefix="¥"
            />
          </Form.Item>

          <Form.Item
            name="exception"
            label="异常情况"
          >
            <Input.TextArea rows={2} placeholder="请描述异常情况（如无异常可不填）" />
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
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="作业回执"
        open={receiptModalVisible}
        onCancel={() => setReceiptModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setReceiptModalVisible(false)}>关闭</Button>,
          currentReceipt?.confirmStatus === 'PENDING' && (
            <>
              <Button key="dispute" danger onClick={handleDisputeReceipt}>
                提出异议
              </Button>
              <Button key="confirm" type="primary" icon={<CheckCircleOutlined />} onClick={handleConfirmReceipt}>
                确认回执
              </Button>
            </>
          )
        ]}
      >
        {currentReceipt && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="记录ID">{currentRecord?.id}</Descriptions.Item>
              <Descriptions.Item label="农户">{currentRecord?.farmerName}</Descriptions.Item>
              <Descriptions.Item label="作业项目">{currentRecord?.workItemName}</Descriptions.Item>
              <Descriptions.Item label="实际亩数">{currentRecord?.actualAcreage}亩</Descriptions.Item>
              <Descriptions.Item label="总费用">¥{currentRecord?.totalCost}</Descriptions.Item>
              <Descriptions.Item label="确认状态">
                {(() => {
                  const cfg = receiptStatusMap[currentReceipt.confirmStatus] || { color: 'gray', text: currentReceipt.confirmStatus };
                  return <Tag color={cfg.color}>{cfg.text}</Tag>;
                })()}
              </Descriptions.Item>
              {currentReceipt.confirmDate && (
                <Descriptions.Item label="确认时间">{currentReceipt.confirmDate}</Descriptions.Item>
              )}
              {currentReceipt.disputeContent && (
                <Descriptions.Item label="争议内容" style={{ color: 'red' }}>
                  {currentReceipt.disputeContent}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkRecord;
