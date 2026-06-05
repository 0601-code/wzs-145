package com.farmgear.core.service.impl;

import com.farmgear.core.dto.ScheduleCheckDTO;
import com.farmgear.core.mapper.WorkScheduleMapper;
import com.farmgear.core.service.ScheduleConflictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ScheduleConflictServiceImpl implements ScheduleConflictService {

    @Autowired
    private WorkScheduleMapper workScheduleMapper;

    @Override
    public boolean checkMachineConflict(Long machineId, LocalDate scheduleDate, Long excludeScheduleId) {
        int count = workScheduleMapper.countByMachineAndDate(machineId, scheduleDate, excludeScheduleId);
        return count > 0;
    }

    @Override
    public boolean checkDriverConflict(Long driverId, LocalDate scheduleDate, Long excludeScheduleId) {
        int count = workScheduleMapper.countByDriverAndDate(driverId, scheduleDate, excludeScheduleId);
        return count > 0;
    }

    @Override
    public ScheduleConflictResult checkScheduleConflict(ScheduleCheckDTO checkDTO) {
        if (checkDTO.getMachineId() != null) {
            boolean machineConflict = checkMachineConflict(
                    checkDTO.getMachineId(),
                    checkDTO.getScheduleDate(),
                    checkDTO.getExcludeScheduleId()
            );
            if (machineConflict) {
                return ScheduleConflictResult.machineConflict(
                        "该农机在 " + checkDTO.getScheduleDate() + " 已有排班安排"
                );
            }
        }

        if (checkDTO.getDriverId() != null) {
            boolean driverConflict = checkDriverConflict(
                    checkDTO.getDriverId(),
                    checkDTO.getScheduleDate(),
                    checkDTO.getExcludeScheduleId()
            );
            if (driverConflict) {
                return ScheduleConflictResult.driverConflict(
                        "该司机在 " + checkDTO.getScheduleDate() + " 已有排班安排"
                );
            }
        }

        return ScheduleConflictResult.noConflict();
    }
}
