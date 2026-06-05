package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("work_record")
public class WorkRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long scheduleId;
    private Long requirementId;
    private Long machineId;
    private Long driverId;
    private LocalDate workDate;
    private BigDecimal actualAcreage;
    private BigDecimal workHours;
    private BigDecimal fuelConsumption;
    private BigDecimal totalCost;
    private String exception;
    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableLogic
    private Integer deleted;

    @TableField(exist = false)
    private String farmerName;

    @TableField(exist = false)
    private String machineName;

    @TableField(exist = false)
    private String driverName;

    @TableField(exist = false)
    private String workItemName;
}
