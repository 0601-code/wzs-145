# 农机调度管理系统

一套完整的农机作业调度管理解决方案，适用于合作社、农机手和村干部协同作业管理。

## 功能特性

### 核心模块

1. **作业需求管理**
   - 农户登记作业需求（地块位置、亩数、期望日期）
   - 需求状态跟踪（待调度、已安排、已完成、已取消）

2. **农机排班调度**
   - 智能排班冲突检测（农机/司机时间冲突）
   - 拖拽式排班（待实现）
   - 排班状态管理

3. **作业记录管理**
   - 作业完成后记录（油耗、工时、费用、异常）
   - 自动费用计算
   - 作业回执确认（农户确认/异议）

4. **农机档案管理**
   - 农机基础信息维护
   - 保养周期设置
   - 保养提醒功能
   - 维修保养记录

5. **司机管理**
   - 司机信息维护
   - 驾照类型管理
   - 状态跟踪

6. **作业项目管理**
   - 作业类型定义（收麦、旋地、插秧等）
   - 单价配置（可随时调整，不影响历史数据）

### 技术特性

- **模块化设计**：排班冲突、费用计算、保养提醒、作业回执独立模块
- **前后端分离**：Java Spring Boot + React + Ant Design
- **JWT认证**：安全的用户认证机制
- **Docker部署**：一键部署，开箱即用

## 技术栈

### 后端
- Java 11
- Spring Boot 2.7.x
- MyBatis-Plus 3.5.x
- MySQL 8.0
- JJWT 0.11.x

### 前端
- React 18
- Ant Design 5.x
- React Router 6
- Axios
- Day.js

## 项目结构

```
.
├── farmgear-core/          # 后端服务
│   ├── src/
│   │   └── main/
│   │       ├── java/com/farmgear/core/
│   │       │   ├── common/        # 通用工具类
│   │       │   ├── config/        # 配置类
│   │       │   ├── controller/    # 控制器
│   │       │   ├── dto/           # 数据传输对象
│   │       │   ├── entity/        # 实体类
│   │       │   ├── mapper/        # 数据访问层
│   │       │   └── service/       # 业务逻辑层
│   │       │       └── impl/
│   │       └── resources/
│   ├── pom.xml
│   └── Dockerfile
│
├── farmgear-board/         # 前端应用
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API服务
│   │   └── utils/          # 工具函数
│   ├── public/
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
│
└── docker-compose.yml      # 一键部署配置
```

## 快速开始

### 方式一：Docker 部署（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd wzs-145

# 一键启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

访问地址：
- 前端：http://localhost
- 后端API：http://localhost:8080/api
- 数据库：localhost:3306

### 方式二：本地开发

#### 启动后端

```bash
cd farmgear-core

# 确保本地MySQL已启动，并创建数据库
# 修改 src/main/resources/application.yml 中的数据库配置

# 启动
mvn spring-boot:run
```

#### 启动前端

```bash
cd farmgear-board

# 安装依赖
npm install

# 启动开发服务器
npm start
```

访问：http://localhost:3000

## 初始化数据

系统启动时自动初始化以下示例数据：

### 农机类型
- 拖拉机、收割机、插秧机、旋耕机

### 作业项目
- 小麦收割（60元/亩）
- 水稻收割（70元/亩）
- 旋地（40元/亩）
- 插秧（50元/亩）
- 耕地（45元/亩）

### 测试用户
| 用户名 | 角色 | 说明 |
|--------|------|------|
| admin | 管理员 | 系统管理员 |
| coop1 | 合作社 | 合作社账号 |
| farmer1 | 农户 | 农户账号 |

*密码：任意（开发环境，生产环境需配置BCrypt密码）*

### 司机
- 王司机（G2驾照）
- 赵司机（G2驾照）
- 孙司机（G1驾照）

### 农机
- M001 东方红拖拉机
- M002 雷沃收割机
- M003 久保田插秧机
- M004 旋耕机

## 模块化设计说明

### 1. 排班冲突检测 (ScheduleConflictService)
独立模块，检查农机和司机在指定日期是否已有排班安排。
- 支持排除自身排班ID（编辑时）
- 可单独调用进行预检查

### 2. 费用计算 (CostCalculationService)
独立模块，根据作业项目和亩数计算费用。
- 支持按单价×亩数计算
- 可扩展燃油费、人工费等
- 收费方式调整不影响农机档案模块

### 3. 保养提醒 (MaintenanceReminderService)
独立模块，根据累计工时和保养周期判断是否需要保养。
- 阈值可配置（默认提前20小时提醒）
- 支持查询单台农机保养状态
- 支持查询所有需保养农机列表

### 4. 作业回执 (WorkReceiptService)
独立模块，管理作业回执确认流程。
- 待确认、已确认、有争议三种状态
- 支持农户提出异议
- 回执统计功能

## API 接口文档

### 认证接口
- `POST /api/auth/login` - 用户登录

### 作业需求
- `GET /api/work-requirement/list` - 获取需求列表
- `POST /api/work-requirement/submit` - 提交作业需求
- `PUT /api/work-requirement/update` - 更新需求
- `DELETE /api/work-requirement/{id}` - 删除需求

### 排班管理
- `GET /api/work-schedule/list` - 获取排班列表
- `POST /api/work-schedule/check-conflict` - 检查冲突
- `POST /api/work-schedule/create` - 创建排班
- `PUT /api/work-schedule/cancel` - 取消排班

### 作业记录
- `GET /api/work-record/list` - 获取作业记录列表
- `POST /api/work-record/create` - 创建作业记录
- `GET /api/work-record/calculate-cost` - 计算费用

### 农机管理
- `GET /api/machine/list` - 获取农机列表
- `POST /api/machine/add` - 添加农机
- `GET /api/machine/{id}/maintenance-info` - 获取保养信息
- `GET /api/machine/needs-maintenance` - 获取需保养农机列表

### 作业回执
- `GET /api/work-receipt/by-record/{recordId}` - 获取回执
- `POST /api/work-receipt/{id}/confirm` - 确认回执
- `POST /api/work-receipt/{id}/dispute` - 提出异议
- `GET /api/work-receipt/statistics` - 回执统计

## 常见问题

### 1. 如何修改作业单价？
在"作业项目管理"页面编辑对应项目的单价即可。新单价仅影响后续作业，不影响历史记录。

### 2. 农机保养提醒如何工作？
系统根据累计工时和保养周期自动计算，当剩余工时小于20小时时会在首页显示提醒。

### 3. 如何处理排班冲突？
创建排班时系统会自动检查冲突，如有冲突会提示具体原因。

### 4. 农户如何确认作业？
作业完成后，系统自动生成回执，农户可在作业记录详情中确认或提出异议。

## 开发计划

- [ ] 日历视图排班
- [ ] 消息通知（短信/微信）
- [ ] 数据统计报表
- [ ] 移动端适配
- [ ] 作业轨迹追踪

## 许可证

MIT License
