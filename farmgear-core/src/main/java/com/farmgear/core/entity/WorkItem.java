package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("work_item")
public class WorkItem {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String itemName;
    private String itemCode;
    private BigDecimal unitPrice;
    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableLogic
    private Integer deleted;
}
