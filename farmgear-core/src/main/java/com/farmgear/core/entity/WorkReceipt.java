package com.farmgear.core.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("work_receipt")
public class WorkReceipt {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long recordId;
    private Long farmerId;
    private String farmerSignature;
    private String confirmStatus;
    private LocalDateTime confirmDate;
    private String disputeContent;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
