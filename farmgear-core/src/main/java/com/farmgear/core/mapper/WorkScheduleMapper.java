package com.farmgear.core.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.farmgear.core.entity.WorkSchedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.time.LocalDate;
import java.util.List;

@Mapper
public interface WorkScheduleMapper extends BaseMapper<WorkSchedule> {

    @Select("SELECT ws.*, wr.farmer_name, wr.plot_location, m.machine_name, d.driver_name, wi.item_name as work_item_name " +
            "FROM work_schedule ws " +
            "LEFT JOIN work_requirement wr ON ws.requirement_id = wr.id " +
            "LEFT JOIN machine m ON ws.machine_id = m.id " +
            "LEFT JOIN driver d ON ws.driver_id = d.id " +
            "LEFT JOIN work_item wi ON wr.work_item_id = wi.id " +
            "WHERE ws.deleted = 0 ORDER BY ws.schedule_date DESC")
    List<WorkSchedule> selectListWithDetail();

    @Select("SELECT COUNT(*) FROM work_schedule " +
            "WHERE machine_id = #{machineId} AND schedule_date = #{scheduleDate} " +
            "AND status != 'CANCELLED' AND deleted = 0 " +
            "AND (#{excludeId} IS NULL OR id != #{excludeId})")
    int countByMachineAndDate(@Param("machineId") Long machineId,
                              @Param("scheduleDate") LocalDate scheduleDate,
                              @Param("excludeId") Long excludeId);

    @Select("SELECT COUNT(*) FROM work_schedule " +
            "WHERE driver_id = #{driverId} AND schedule_date = #{scheduleDate} " +
            "AND status != 'CANCELLED' AND deleted = 0 " +
            "AND (#{excludeId} IS NULL OR id != #{excludeId})")
    int countByDriverAndDate(@Param("driverId") Long driverId,
                             @Param("scheduleDate") LocalDate scheduleDate,
                             @Param("excludeId") Long excludeId);
}
