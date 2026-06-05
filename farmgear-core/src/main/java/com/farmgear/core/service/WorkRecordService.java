package com.farmgear.core.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.farmgear.core.entity.WorkRecord;

import java.util.List;

public interface WorkRecordService extends IService<WorkRecord> {

    List<WorkRecord> listWithDetail();

    boolean createWorkRecord(WorkRecord record);

    WorkRecord createFromSchedule(Long scheduleId);
}
