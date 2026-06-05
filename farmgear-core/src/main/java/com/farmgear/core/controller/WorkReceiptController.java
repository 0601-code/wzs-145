package com.farmgear.core.controller;

import com.farmgear.core.common.Result;
import com.farmgear.core.entity.WorkReceipt;
import com.farmgear.core.service.WorkReceiptService;
import com.farmgear.core.service.WorkReceiptService.ReceiptStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/work-receipt")
public class WorkReceiptController {

    @Autowired
    private WorkReceiptService workReceiptService;

    @GetMapping("/by-record/{recordId}")
    public Result<WorkReceipt> getByRecordId(@PathVariable Long recordId) {
        return Result.success(workReceiptService.getReceiptByRecordId(recordId));
    }

    @PostMapping("/{id}/confirm")
    public Result<Boolean> confirm(@PathVariable Long id, @RequestParam(required = false) String signature) {
        return Result.success(workReceiptService.confirmReceipt(id, signature));
    }

    @PostMapping("/{id}/dispute")
    public Result<Boolean> dispute(@PathVariable Long id, @RequestParam String disputeContent) {
        return Result.success(workReceiptService.disputeReceipt(id, disputeContent));
    }

    @GetMapping("/statistics")
    public Result<ReceiptStatistics> getStatistics() {
        return Result.success(workReceiptService.getReceiptStatistics());
    }
}
