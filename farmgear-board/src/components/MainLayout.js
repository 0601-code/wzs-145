import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CarOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '数据概览',
    },
    {
      key: '/requirement',
      icon: <FileTextOutlined />,
      label: '作业需求',
    },
    {
      key: '/schedule',
      icon: <CalendarOutlined />,
      label: '农机排班',
    },
    {
      key: '/record',
      icon: <CheckCircleOutlined />,
      label: '作业记录',
    },
    {
      key: '/machine',
      icon: <CarOutlined />,
      label: '农机档案',
    },
    {
      key: '/driver',
      icon: <UserOutlined />,
      label: '司机管理',
    },
    {
      key: '/work-item',
      icon: <SettingOutlined />,
      label: '作业项目',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined /> 个人中心
        </span>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: (
        <span onClick={handleLogout}>
          <LogoutOutlined /> 退出登录
        </span>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
          background: 'rgba(255,255,255,0.1)'
        }}>
          {collapsed ? '农机' : '农机调度系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <span>{userInfo.realName || '用户'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
