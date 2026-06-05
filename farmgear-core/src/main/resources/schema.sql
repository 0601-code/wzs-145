CREATE DATABASE IF NOT EXISTS farmgear DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE farmgear;

CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    real_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL COMMENT 'ADMIN-管理员, COOP-合作社, DRIVER-农机手, FARMER-农户',
    status TINYINT DEFAULT 1 COMMENT '0-禁用, 1-启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS machine_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL COMMENT '农机类型名称',
    type_code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS work_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL COMMENT '作业项目名称',
    item_code VARCHAR(50) NOT NULL UNIQUE,
    unit_price DECIMAL(10,2) NOT NULL COMMENT '单价(元/亩)',
    description VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS machine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    machine_no VARCHAR(50) NOT NULL UNIQUE COMMENT '农机编号',
    machine_name VARCHAR(100) NOT NULL,
    type_id BIGINT NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    purchase_date DATE,
    maintenance_cycle_hours INT COMMENT '保养周期(小时)',
    last_maintenance_hours INT COMMENT '上次保养时工时',
    total_hours INT DEFAULT 0 COMMENT '累计工时',
    status VARCHAR(20) DEFAULT 'IDLE' COMMENT 'IDLE-空闲, WORKING-作业中, MAINTENANCE-保养中, BROKEN-故障',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (type_id) REFERENCES machine_type(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS maintenance_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    machine_id BIGINT NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(20) COMMENT 'REGULAR-常规保养, REPAIR-维修',
    description VARCHAR(500),
    cost DECIMAL(10,2),
    current_hours INT COMMENT '当前工时',
    operator VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (machine_id) REFERENCES machine(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS driver (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    driver_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    id_card VARCHAR(20),
    license_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'AVAILABLE' COMMENT 'AVAILABLE-可用, BUSY-作业中, LEAVE-休假',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS work_requirement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    farmer_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    village VARCHAR(100) COMMENT '村庄',
    plot_location VARCHAR(200) NOT NULL COMMENT '地块位置描述',
    acreage DECIMAL(10,2) NOT NULL COMMENT '亩数',
    work_item_id BIGINT NOT NULL,
    expected_date DATE NOT NULL COMMENT '期望作业日期',
    remark VARCHAR(500),
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING-待调度, ASSIGNED-已安排, COMPLETED-已完成, CANCELLED-已取消',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (work_item_id) REFERENCES work_item(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS work_schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requirement_id BIGINT NOT NULL,
    machine_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    schedule_date DATE NOT NULL COMMENT '排班日期',
    start_time DATETIME,
    end_time DATETIME,
    status VARCHAR(20) DEFAULT 'SCHEDULED' COMMENT 'SCHEDULED-已排班, IN_PROGRESS-进行中, COMPLETED-已完成, CANCELLED-已取消',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (requirement_id) REFERENCES work_requirement(id),
    FOREIGN KEY (machine_id) REFERENCES machine(id),
    FOREIGN KEY (driver_id) REFERENCES driver(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS work_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    requirement_id BIGINT NOT NULL,
    machine_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    work_date DATE NOT NULL,
    actual_acreage DECIMAL(10,2) COMMENT '实际作业亩数',
    work_hours DECIMAL(5,2) COMMENT '作业工时(小时)',
    fuel_consumption DECIMAL(10,2) COMMENT '油耗(升)',
    total_cost DECIMAL(10,2) COMMENT '总费用',
    exception VARCHAR(500) COMMENT '异常情况',
    remark VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (schedule_id) REFERENCES work_schedule(id),
    FOREIGN KEY (requirement_id) REFERENCES work_requirement(id),
    FOREIGN KEY (machine_id) REFERENCES machine(id),
    FOREIGN KEY (driver_id) REFERENCES driver(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS work_receipt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    record_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    farmer_signature VARCHAR(200),
    confirm_status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING-待确认, CONFIRMED-已确认, DISPUTED-有争议',
    confirm_date DATETIME,
    dispute_content VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (record_id) REFERENCES work_record(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO machine_type (type_name, type_code, description) VALUES
('拖拉机', 'TRACTOR', '用于耕地、播种等作业的拖拉机'),
('收割机', 'HARVESTER', '用于收割小麦、水稻等作物的收割机'),
('插秧机', 'TRANSPLANTER', '用于水稻插秧的插秧机'),
('旋耕机', 'ROTARY', '用于旋地作业的旋耕机');

INSERT INTO work_item (item_name, item_code, unit_price, description) VALUES
('小麦收割', 'WHEAT_HARVEST', 60.00, '小麦收割作业'),
('水稻收割', 'RICE_HARVEST', 70.00, '水稻收割作业'),
('旋地', 'ROTARY_TILLAGE', 40.00, '旋耕整地作业'),
('插秧', 'TRANSPLANTING', 50.00, '水稻插秧作业'),
('耕地', 'PLOUGHING', 45.00, '耕地作业');

INSERT INTO sys_user (username, password, real_name, phone, role, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '管理员', '13800138000', 'ADMIN', 1),
('coop1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '张合作社', '13800138001', 'COOP', 1),
('farmer1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '李农户', '13800138002', 'FARMER', 1);

INSERT INTO driver (driver_name, phone, id_card, license_type, status) VALUES
('王司机', '13900139001', '410101199001010001', 'G2', 'AVAILABLE'),
('赵司机', '13900139002', '410101199002020002', 'G2', 'AVAILABLE'),
('孙司机', '13900139003', '410101199003030003', 'G1', 'AVAILABLE');

INSERT INTO machine (machine_no, machine_name, type_id, brand, model, purchase_date, maintenance_cycle_hours, last_maintenance_hours, total_hours, status) VALUES
('M001', '东方红拖拉机', 1, '东方红', 'LX804', '2023-01-15', 200, 0, 0, 'IDLE'),
('M002', '雷沃收割机', 2, '雷沃', 'GN70', '2023-03-20', 150, 0, 0, 'IDLE'),
('M003', '久保田插秧机', 3, '久保田', 'NSPU-68C', '2023-04-10', 100, 0, 0, 'IDLE'),
('M004', '旋耕机', 4, '亚奥', '1GQN-200', '2023-02-28', 180, 0, 0, 'IDLE');
