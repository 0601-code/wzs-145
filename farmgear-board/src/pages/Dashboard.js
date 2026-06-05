import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Space, Alert } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {
  getMachineList,
  getDriverList,
  getWorkRequirementList,
  getWorkRecordList,
  getMachinesNeedingMaintenance
} from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    machineCount: 0,
    driverCount: 0,
    requirementCount: 0,
    recordCount: 0,
  });
  const [requirements, setRequirements] = useState([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [machines, drivers, requirements, records, alerts] = await Promise.all([
        getMachineList(),
        getDriverList(),
        getWorkRequirementList(),
        getWorkRecordList(),
        getMachinesNeedingMaintenance().catch(() => [])
      ]);

      setStats({
        machineCount: machines.length,
        driverCount: drivers.length,
        requirementCount: requirements.length,
        recordCount: records.length,
      });

      setRequirements(requirements.slice(0, 5));
      setMaintenanceAlerts(alerts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    PENDING: { color: 'orange', text: '待调度' },
    ASSIGNED: { color: 'blue', text: '已安排' },
    COMPLETED: { color: 'green', text: '已完成' },
    CANCELLED: { color: 'gray', text: '已取消' },
  };

  const requirementColumns = [
    {
      title: '农户姓名',
      dataIndex: 'farmerName',
      key: 'farmerName',
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
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据概览</h2>

      {maintenanceAlerts.length > 0 && (
        <Alert
          message="保养提醒"
          description={`有 ${maintenanceAlerts.length} 台农机需要保养：${maintenanceAlerts.map(m => m.machineName).join('、')}`}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 24 }}
          closable
        />
      )}

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="农机总数"
              value={stats.machineCount}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="司机总数"
              value={stats.driverCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="作业需求"
              value={stats.requirementCount}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="作业记录"
              value={stats.recordCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最新作业需求" extra={<a href="#/requirement">查看全部</a>}>
        <Table
          columns={requirementColumns}
          dataSource={requirements}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
