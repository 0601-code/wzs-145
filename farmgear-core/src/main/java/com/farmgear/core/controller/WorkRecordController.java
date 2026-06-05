package com.farmgear.core.controller;

import com.farmgear.core.common.Result;
import com.farmgear.core.entity.WorkRecord;
import com.farmgear.core.service.CostCalculationService;
import com.farmgear.core.service.CostCalculationService.CostDetail;
import com.farmgear.core.service.WorkRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/work-record")
public class WorkRecordController {

    @Autowired
    private WorkRecordService workRecordService;

    @Autowired
    private CostCalculationService costCalculationService;

    @GetMapping("/list")
    public Result<List<WorkRecord>> list() {
        return Result.success(workRecordService.listWithDetail());
    }

    @GetMapping("/{id}")
    public Result<WorkRecord> getById(@PathVariable Long id) {
        return Result.success(workRecordService.getById(id));
    }

    @GetMapping("/from-schedule/{scheduleId}")
    public Result<WorkRecord> fromSchedule(@PathVariable Long scheduleId) {
        return Result.success(workRecordService.createFromSchedule(scheduleId));
    }

    @PostMapping("/create")
    public Result<Boolean> create(@RequestBody WorkRecord record) {
        return Result.success(workRecordService.createWorkRecord(record));
    }

    @PutMapping("/update")
    public Result<Boolean> update(@RequestBody WorkRecord record) {
        return Result.success(workRecordService.updateById(record));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(workRecordService.removeById(id));
    }

    @GetMapping("/calculate-cost")
    public Result<CostDetail> calculateCost(
            @RequestParam Long workItemId,
            @RequestParam BigDecimal acreage,
            @RequestParam(required = false) BigDecimal fuelConsumption,
            @RequestParam(required = false) BigDecimal workHours) {
        return Result.success(costCalculationService.calculateDetailCost(
                workItemId, acreage, fuelConsumption, workHours
        ));
    }
}
