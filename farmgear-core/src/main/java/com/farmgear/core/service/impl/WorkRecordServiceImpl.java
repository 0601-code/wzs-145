package com.farmgear.core.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.farmgear.core.entity.WorkRecord;
import com.farmgear.core.entity.WorkSchedule;
import com.farmgear.core.mapper.WorkRecordMapper;
import com.farmgear.core.service.CostCalculationService;
import com.farmgear.core.service.MachineService;
import com.farmgear.core.service.WorkRecordService;
import com.farmgear.core.service.WorkReceiptService;
import com.farmgear.core.service.WorkScheduleService;
import com.farmgear.core.service.WorkRequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class WorkRecordServiceImpl extends ServiceImpl<WorkRecordMapper, WorkRecord> implements WorkRecordService {

    @Autowired
    private WorkRecordMapper workRecordMapper;

    @Autowired
    private WorkScheduleService workScheduleService;

    @Autowired
    private WorkRequirementService workRequirementService;

    @Autowired
    private CostCalculationService costCalculationService;

    @Autowired
    private MachineService machineService;

    @Autowired
    private WorkReceiptService workReceiptService;

    @Override
    public List<WorkRecord> listWithDetail() {
        return workRecordMapper.selectListWithDetail();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean createWorkRecord(WorkRecord record) {
        if (record.getActualAcreage() != null) {
            WorkSchedule schedule = workScheduleService.getById(record.getScheduleId());
            if (schedule != null) {
                var requirement = workRequirementService.getById(schedule.getRequirementId());
                if (requirement != null) {
                    BigDecimal totalCost = costCalculationService.calculateWorkCost(
                            requirement.getWorkItemId(),
                            record.getActualAcreage()
                    );
                    record.setTotalCost(totalCost);
                }
            }
        }

        boolean success = this.save(record);

        if (success) {
            if (record.getWorkHours() != null) {
                machineService.addWorkHours(record.getMachineId(), record.getWorkHours().intValue());
            }

            WorkSchedule schedule = workScheduleService.getById(record.getScheduleId());
            if (schedule != null) {
                schedule.setStatus("COMPLETED");
                workScheduleService.updateById(schedule);

                var requirement = workRequirementService.getById(schedule.getRequirementId());
                if (requirement != null) {
                    requirement.setStatus("COMPLETED");
                    workRequirementService.updateById(requirement);

                    workReceiptService.createReceipt(record.getId(), requirement.getFarmerId());
                }
            }
        }

        return success;
    }

    @Override
    public WorkRecord createFromSchedule(Long scheduleId) {
        WorkSchedule schedule = workScheduleService.getById(scheduleId);
        if (schedule == null) {
            return null;
        }

        WorkRecord record = new WorkRecord();
        record.setScheduleId(scheduleId);
        record.setRequirementId(schedule.getRequirementId());
        record.setMachineId(schedule.getMachineId());
        record.setDriverId(schedule.getDriverId());
        record.setWorkDate(LocalDate.now());

        return record;
    }
}
