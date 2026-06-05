package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("machine_type")
public class MachineType {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String typeName;
    private String typeCode;
    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableLogic
    private Integer deleted;
}
