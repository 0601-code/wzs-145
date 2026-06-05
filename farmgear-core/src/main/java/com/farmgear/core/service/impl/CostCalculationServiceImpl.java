package com.farmgear.core.service.impl;

import com.farmgear.core.entity.WorkItem;
import com.farmgear.core.mapper.WorkItemMapper;
import com.farmgear.core.service.CostCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CostCalculationServiceImpl implements CostCalculationService {

    @Autowired
    private WorkItemMapper workItemMapper;

    private static final BigDecimal FUEL_PRICE = new BigDecimal("7.5");

    @Override
    public BigDecimal calculateWorkCost(Long workItemId, BigDecimal acreage) {
        WorkItem workItem = workItemMapper.selectById(workItemId);
        if (workItem == null) {
            return BigDecimal.ZERO;
        }
        return calculateWorkCost(workItem.getUnitPrice(), acreage);
    }

    @Override
    public BigDecimal calculateWorkCost(BigDecimal unitPrice, BigDecimal acreage) {
        if (unitPrice == null || acreage == null) {
            return BigDecimal.ZERO;
        }
        return unitPrice.multiply(acreage).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public CostDetail calculateDetailCost(Long workItemId, BigDecimal acreage, BigDecimal fuelConsumption, BigDecimal workHours) {
        CostDetail detail = new CostDetail();
        WorkItem workItem = workItemMapper.selectById(workItemId);

        if (workItem != null) {
            detail.setUnitPrice(workItem.getUnitPrice());
            BigDecimal workCost = calculateWorkCost(workItem.getUnitPrice(), acreage);
            detail.setWorkCost(workCost);
        }

        detail.setAcreage(acreage);

        if (fuelConsumption != null) {
            BigDecimal fuelCost = fuelConsumption.multiply(FUEL_PRICE).setScale(2, RoundingMode.HALF_UP);
            detail.setFuelCost(fuelCost);
        } else {
            detail.setFuelCost(BigDecimal.ZERO);
        }

        BigDecimal totalCost = detail.getWorkCost() != null ? detail.getWorkCost() : BigDecimal.ZERO;
        detail.setTotalCost(totalCost);

        return detail;
    }
}
