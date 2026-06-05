package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("work_schedule")
public class WorkSchedule {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long requirementId;
    private Long machineId;
    private Long driverId;
    private LocalDate scheduleDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;

    @TableField(exist = false)
    private String farmerName;

    @TableField(exist = false)
    private String plotLocation;

    @TableField(exist = false)
    private String machineName;

    @TableField(exist = false)
    private String driverName;

    @TableField(exist = false)
    private String workItemName;
}
