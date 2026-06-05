package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("driver")
public class Driver {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String driverName;
    private String phone;
    private String idCard;
    private String licenseType;
    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableLogic
    private Integer deleted;
}
