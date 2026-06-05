package com.farmgear.core.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.farmgear.core.entity.Machine;
import com.farmgear.core.entity.MaintenanceRecord;
import com.farmgear.core.mapper.MachineMapper;
import com.farmgear.core.mapper.MaintenanceRecordMapper;
import com.farmgear.core.service.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MachineServiceImpl extends ServiceImpl<MachineMapper, Machine> implements MachineService {

    @Autowired
    private MachineMapper machineMapper;

    @Autowired
    private MaintenanceRecordMapper maintenanceRecordMapper;

    @Override
    public List<Machine> listWithType() {
        return machineMapper.selectListWithType();
    }

    @Override
    public boolean addWorkHours(Long machineId, int hours) {
        Machine machine = this.getById(machineId);
        if (machine == null) {
            return false;
        }
        int currentHours = machine.getTotalHours() != null ? machine.getTotalHours() : 0;
        machine.setTotalHours(currentHours + hours);
        return this.updateById(machine);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordMaintenance(MaintenanceRecord record) {
        int result = maintenanceRecordMapper.insert(record);
        if (result > 0) {
            Machine machine = this.getById(record.getMachineId());
            if (machine != null) {
                machine.setLastMaintenanceHours(record.getCurrentHours());
                machine.setStatus("IDLE");
                this.updateById(machine);
            }
            return true;
        }
        return false;
    }

    @Override
    public List<MaintenanceRecord> getMaintenanceRecords(Long machineId) {
        return maintenanceRecordMapper.selectList(
                new LambdaQueryWrapper<MaintenanceRecord>()
                        .eq(MaintenanceRecord::getMachineId, machineId)
                        .eq(MaintenanceRecord::getDeleted, 0)
                        .orderByDesc(MaintenanceRecord::getMaintenanceDate)
        );
    }
}
