package com.farmgear.core.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.farmgear.core.dto.ScheduleCheckDTO;
import com.farmgear.core.entity.WorkSchedule;
import com.farmgear.core.mapper.WorkScheduleMapper;
import com.farmgear.core.service.ScheduleConflictService;
import com.farmgear.core.service.ScheduleConflictService.ScheduleConflictResult;
import com.farmgear.core.service.WorkRequirementService;
import com.farmgear.core.service.WorkScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkScheduleServiceImpl extends ServiceImpl<WorkScheduleMapper, WorkSchedule> implements WorkScheduleService {

    @Autowired
    private WorkScheduleMapper workScheduleMapper;

    @Autowired
    private ScheduleConflictService scheduleConflictService;

    @Autowired
    private WorkRequirementService workRequirementService;

    @Override
    public List<WorkSchedule> listWithDetail() {
        return workScheduleMapper.selectListWithDetail();
    }

    @Override
    public ScheduleConflictResult checkConflict(WorkSchedule schedule) {
        ScheduleCheckDTO checkDTO = new ScheduleCheckDTO();
        checkDTO.setMachineId(schedule.getMachineId());
        checkDTO.setDriverId(schedule.getDriverId());
        checkDTO.setScheduleDate(schedule.getScheduleDate());
        checkDTO.setExcludeScheduleId(schedule.getId());
        return scheduleConflictService.checkScheduleConflict(checkDTO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean createSchedule(WorkSchedule schedule) {
        ScheduleConflictResult conflict = checkConflict(schedule);
        if (conflict.isHasConflict()) {
            throw new RuntimeException(conflict.getMessage());
        }

        schedule.setStatus("SCHEDULED");
        boolean success = this.save(schedule);
        if (success) {
            workRequirementService.updateStatus(schedule.getRequirementId(), "ASSIGNED");
        }
        return success;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateSchedule(WorkSchedule schedule) {
        ScheduleConflictResult conflict = checkConflict(schedule);
        if (conflict.isHasConflict()) {
            throw new RuntimeException(conflict.getMessage());
        }
        return this.updateById(schedule);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancelSchedule(Long id) {
        WorkSchedule schedule = this.getById(id);
        if (schedule == null) {
            return false;
        }
        schedule.setStatus("CANCELLED");
        boolean success = this.updateById(schedule);
        if (success) {
            workRequirementService.updateStatus(schedule.getRequirementId(), "PENDING");
        }
        return success;
    }
}
