package com.farmgear.core.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.farmgear.core.entity.WorkSchedule;
import com.farmgear.core.service.ScheduleConflictService.ScheduleConflictResult;

import java.util.List;

public interface WorkScheduleService extends IService<WorkSchedule> {

    List<WorkSchedule> listWithDetail();

    ScheduleConflictResult checkConflict(WorkSchedule schedule);

    boolean createSchedule(WorkSchedule schedule);

    boolean updateSchedule(WorkSchedule schedule);

    boolean cancelSchedule(Long id);
}
