package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("work_requirement")
public class WorkRequirement {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String phone;
    private String village;
    private String plotLocation;
    private BigDecimal acreage;
    private Long workItemId;
    private LocalDate expectedDate;
    private String remark;
    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;

    @TableField(exist = false)
    private String workItemName;

    @TableField(exist = false)
    private BigDecimal unitPrice;
}
