package com.farmgear.core.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.farmgear.core.entity.Machine;
import com.farmgear.core.entity.MaintenanceRecord;

import java.util.List;

public interface MachineService extends IService<Machine> {

    List<Machine> listWithType();

    boolean addWorkHours(Long machineId, int hours);

    boolean recordMaintenance(MaintenanceRecord record);

    List<MaintenanceRecord> getMaintenanceRecords(Long machineId);
}
