package com.farmgear.core.controller;

import com.farmgear.core.common.Result;
import com.farmgear.core.entity.WorkSchedule;
import com.farmgear.core.service.ScheduleConflictService.ScheduleConflictResult;
import com.farmgear.core.service.WorkScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work-schedule")
public class WorkScheduleController {

    @Autowired
    private WorkScheduleService workScheduleService;

    @GetMapping("/list")
    public Result<List<WorkSchedule>> list() {
        return Result.success(workScheduleService.listWithDetail());
    }

    @GetMapping("/{id}")
    public Result<WorkSchedule> getById(@PathVariable Long id) {
        return Result.success(workScheduleService.getById(id));
    }

    @PostMapping("/check-conflict")
    public Result<ScheduleConflictResult> checkConflict(@RequestBody WorkSchedule schedule) {
        return Result.success(workScheduleService.checkConflict(schedule));
    }

    @PostMapping("/create")
    public Result<Boolean> create(@RequestBody WorkSchedule schedule) {
        try {
            return Result.success(workScheduleService.createSchedule(schedule));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<Boolean> update(@RequestBody WorkSchedule schedule) {
        try {
            return Result.success(workScheduleService.updateSchedule(schedule));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public Result<Boolean> cancel(@PathVariable Long id) {
        return Result.success(workScheduleService.cancelSchedule(id));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(workScheduleService.removeById(id));
    }
}
