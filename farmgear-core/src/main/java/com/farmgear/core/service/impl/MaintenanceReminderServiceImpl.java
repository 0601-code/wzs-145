package com.farmgear.core.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.farmgear.core.entity.Machine;
import com.farmgear.core.mapper.MachineMapper;
import com.farmgear.core.service.MaintenanceReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceReminderServiceImpl implements MaintenanceReminderService {

    @Autowired
    private MachineMapper machineMapper;

    private static final int MAINTENANCE_THRESHOLD = 20;

    @Override
    public List<Machine> getMachinesNeedingMaintenance() {
        List<Machine> allMachines = machineMapper.selectList(
                new LambdaQueryWrapper<Machine>().eq(Machine::getDeleted, 0)
        );
        return allMachines.stream()
                .filter(this::needsMaintenance)
                .collect(Collectors.toList());
    }

    @Override
    public boolean needsMaintenance(Machine machine) {
        if (machine.getMaintenanceCycleHours() == null || machine.getMaintenanceCycleHours() == 0) {
            return false;
        }
        int hoursSinceLast = getHoursSinceLastMaintenance(machine);
        return hoursSinceLast >= (machine.getMaintenanceCycleHours() - MAINTENANCE_THRESHOLD);
    }

    @Override
    public int getRemainingHours(Machine machine) {
        if (machine.getMaintenanceCycleHours() == null || machine.getMaintenanceCycleHours() == 0) {
            return Integer.MAX_VALUE;
        }
        int hoursSinceLast = getHoursSinceLastMaintenance(machine);
        return Math.max(0, machine.getMaintenanceCycleHours() - hoursSinceLast);
    }

    @Override
    public MaintenanceInfo getMaintenanceInfo(Long machineId) {
        Machine machine = machineMapper.selectById(machineId);
        if (machine == null) {
            return null;
        }

        MaintenanceInfo info = new MaintenanceInfo();
        info.setMachineId(machine.getId());
        info.setMachineName(machine.getMachineName());
        info.setMachineNo(machine.getMachineNo());
        info.setTotalHours(machine.getTotalHours() != null ? machine.getTotalHours() : 0);
        info.setMaintenanceCycleHours(machine.getMaintenanceCycleHours() != null ? machine.getMaintenanceCycleHours() : 0);
        info.setLastMaintenanceHours(machine.getLastMaintenanceHours() != null ? machine.getLastMaintenanceHours() : 0);

        int hoursSinceLast = getHoursSinceLastMaintenance(machine);
        info.setHoursSinceLastMaintenance(hoursSinceLast);
        info.setRemainingHours(getRemainingHours(machine));
        info.setNeedsMaintenance(needsMaintenance(machine));

        if (info.getRemainingHours() <= 0) {
            info.setMaintenanceStatus("OVERDUE");
        } else if (info.getRemainingHours() <= MAINTENANCE_THRESHOLD) {
            info.setMaintenanceStatus("WARNING");
        } else {
            info.setMaintenanceStatus("NORMAL");
        }

        return info;
    }

    private int getHoursSinceLastMaintenance(Machine machine) {
        int totalHours = machine.getTotalHours() != null ? machine.getTotalHours() : 0;
        int lastMaintenanceHours = machine.getLastMaintenanceHours() != null ? machine.getLastMaintenanceHours() : 0;
        return totalHours - lastMaintenanceHours;
    }
}
