package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("machine")
public class Machine {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String machineNo;
    private String machineName;
    private Long typeId;
    private String brand;
    private String model;
    private LocalDate purchaseDate;
    private Integer maintenanceCycleHours;
    private Integer lastMaintenanceHours;
    private Integer totalHours;
    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;

    @TableField(exist = false)
    private String typeName;
}
