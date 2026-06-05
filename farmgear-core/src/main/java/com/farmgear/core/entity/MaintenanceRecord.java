package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("maintenance_record")
public class MaintenanceRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long machineId;
    private LocalDate maintenanceDate;
    private String maintenanceType;
    private String description;
    private BigDecimal cost;
    private Integer currentHours;
    private String operator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableLogic
    private Integer deleted;
}
