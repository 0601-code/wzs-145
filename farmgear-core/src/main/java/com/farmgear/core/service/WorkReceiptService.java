package com.farmgear.core.service;

import com.farmgear.core.entity.WorkReceipt;

public interface WorkReceiptService {

    WorkReceipt createReceipt(Long recordId, Long farmerId);

    boolean confirmReceipt(Long receiptId, String signature);

    boolean disputeReceipt(Long receiptId, String disputeContent);

    WorkReceipt getReceiptByRecordId(Long recordId);

    ReceiptStatistics getReceiptStatistics();

    class ReceiptStatistics {
        private int totalCount;
        private int pendingCount;
        private int confirmedCount;
        private int disputedCount;

        public int getTotalCount() {
            return totalCount;
        }

        public void setTotalCount(int totalCount) {
            this.totalCount = totalCount;
        }

        public int getPendingCount() {
            return pendingCount;
        }

        public void setPendingCount(int pendingCount) {
            this.pendingCount = pendingCount;
        }

        public int getConfirmedCount() {
            return confirmedCount;
        }

        public void setConfirmedCount(int confirmedCount) {
            this.confirmedCount = confirmedCount;
        }

        public int getDisputedCount() {
            return disputedCount;
        }

        public void setDisputedCount(int disputedCount) {
            this.disputedCount = disputedCount;
        }
    }
}
