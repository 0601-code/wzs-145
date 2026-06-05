package com.farmgear.core.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.farmgear.core.entity.WorkReceipt;
import com.farmgear.core.mapper.WorkReceiptMapper;
import com.farmgear.core.service.WorkReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkReceiptServiceImpl implements WorkReceiptService {

    @Autowired
    private WorkReceiptMapper workReceiptMapper;

    @Override
    public WorkReceipt createReceipt(Long recordId, Long farmerId) {
        WorkReceipt existing = getReceiptByRecordId(recordId);
        if (existing != null) {
            return existing;
        }

        WorkReceipt receipt = new WorkReceipt();
        receipt.setRecordId(recordId);
        receipt.setFarmerId(farmerId);
        receipt.setConfirmStatus("PENDING");
        workReceiptMapper.insert(receipt);
        return receipt;
    }

    @Override
    public boolean confirmReceipt(Long receiptId, String signature) {
        WorkReceipt receipt = workReceiptMapper.selectById(receiptId);
        if (receipt == null) {
            return false;
        }
        receipt.setConfirmStatus("CONFIRMED");
        receipt.setConfirmDate(LocalDateTime.now());
        receipt.setFarmerSignature(signature);
        return workReceiptMapper.updateById(receipt) > 0;
    }

    @Override
    public boolean disputeReceipt(Long receiptId, String disputeContent) {
        WorkReceipt receipt = workReceiptMapper.selectById(receiptId);
        if (receipt == null) {
            return false;
        }
        receipt.setConfirmStatus("DISPUTED");
        receipt.setDisputeContent(disputeContent);
        return workReceiptMapper.updateById(receipt) > 0;
    }

    @Override
    public WorkReceipt getReceiptByRecordId(Long recordId) {
        return workReceiptMapper.selectOne(
                new LambdaQueryWrapper<WorkReceipt>()
                        .eq(WorkReceipt::getRecordId, recordId)
                        .eq(WorkReceipt::getDeleted, 0)
                        .last("LIMIT 1")
        );
    }

    @Override
    public ReceiptStatistics getReceiptStatistics() {
        List<WorkReceipt> allReceipts = workReceiptMapper.selectList(
                new LambdaQueryWrapper<WorkReceipt>().eq(WorkReceipt::getDeleted, 0)
        );

        ReceiptStatistics stats = new ReceiptStatistics();
        stats.setTotalCount(allReceipts.size());
        stats.setPendingCount((int) allReceipts.stream().filter(r -> "PENDING".equals(r.getConfirmStatus())).count());
        stats.setConfirmedCount((int) allReceipts.stream().filter(r -> "CONFIRMED".equals(r.getConfirmStatus())).count());
        stats.setDisputedCount((int) allReceipts.stream().filter(r -> "DISPUTED".equals(r.getConfirmStatus())).count());

        return stats;
    }
}
