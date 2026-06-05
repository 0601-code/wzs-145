package com.farmgear.core.service;

import java.math.BigDecimal;

public interface CostCalculationService {

    BigDecimal calculateWorkCost(Long workItemId, BigDecimal acreage);

    BigDecimal calculateWorkCost(BigDecimal unitPrice, BigDecimal acreage);

    CostDetail calculateDetailCost(Long workItemId, BigDecimal acreage, BigDecimal fuelConsumption, BigDecimal workHours);

    class CostDetail {
        private BigDecimal workCost;
        private BigDecimal fuelCost;
        private BigDecimal totalCost;
        private BigDecimal unitPrice;
        private BigDecimal acreage;

        public CostDetail() {}

        public BigDecimal getWorkCost() {
            return workCost;
        }

        public void setWorkCost(BigDecimal workCost) {
            this.workCost = workCost;
        }

        public BigDecimal getFuelCost() {
            return fuelCost;
        }

        public void setFuelCost(BigDecimal fuelCost) {
            this.fuelCost = fuelCost;
        }

        public BigDecimal getTotalCost() {
            return totalCost;
        }

        public void setTotalCost(BigDecimal totalCost) {
            this.totalCost = totalCost;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }

        public BigDecimal getAcreage() {
            return acreage;
        }

        public void setAcreage(BigDecimal acreage) {
            this.acreage = acreage;
        }
    }
}
