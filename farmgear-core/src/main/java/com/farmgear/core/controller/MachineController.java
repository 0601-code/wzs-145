package com.farmgear.core.controller;

import com.farmgear.core.common.Result;
import com.farmgear.core.entity.Machine;
import com.farmgear.core.entity.MaintenanceRecord;
import com.farmgear.core.entity.MachineType;
import com.farmgear.core.service.MaintenanceReminderService;
import com.farmgear.core.service.MaintenanceReminderService.MaintenanceInfo;
import com.farmgear.core.service.MachineService;
import com.farmgear.core.mapper.MachineTypeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/machine")
public class MachineController {

    @Autowired
    private MachineService machineService;

    @Autowired
    private MachineTypeMapper machineTypeMapper;

    @Autowired
    private MaintenanceReminderService maintenanceReminderService;

    @GetMapping("/list")
    public Result<List<Machine>> list() {
        return Result.success(machineService.listWithType());
    }

    @GetMapping("/{id}")
    public Result<Machine> getById(@PathVariable Long id) {
        return Result.success(machineService.getById(id));
    }

    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody Machine machine) {
        return Result.success(machineService.save(machine));
    }

    @PutMapping("/update")
    public Result<Boolean> update(@RequestBody Machine machine) {
        return Result.success(machineService.updateById(machine));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(machineService.removeById(id));
    }

    @GetMapping("/type/list")
    public Result<List<MachineType>> listTypes() {
        return Result.success(machineTypeMapper.selectList(null));
    }

    @GetMapping("/{id}/maintenance-records")
    public Result<List<MaintenanceRecord>> getMaintenanceRecords(@PathVariable Long id) {
        return Result.success(machineService.getMaintenanceRecords(id));
    }

    @PostMapping("/maintenance-record")
    public Result<Boolean> addMaintenanceRecord(@RequestBody MaintenanceRecord record) {
        return Result.success(machineService.recordMaintenance(record));
    }

    @GetMapping("/{id}/maintenance-info")
    public Result<MaintenanceInfo> getMaintenanceInfo(@PathVariable Long id) {
        return Result.success(maintenanceReminderService.getMaintenanceInfo(id));
    }

    @GetMapping("/needs-maintenance")
    public Result<List<Machine>> getMachinesNeedingMaintenance() {
        return Result.success(maintenanceReminderService.getMachinesNeedingMaintenance());
    }
}
