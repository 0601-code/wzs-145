package com.farmgear.core.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.farmgear.core.entity.WorkRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface WorkRecordMapper extends BaseMapper<WorkRecord> {

    @Select("SELECT wr.*, wrr.farmer_name, m.machine_name, d.driver_name, wi.item_name as work_item_name " +
            "FROM work_record wr " +
            "LEFT JOIN work_requirement wrr ON wr.requirement_id = wrr.id " +
            "LEFT JOIN machine m ON wr.machine_id = m.id " +
            "LEFT JOIN driver d ON wr.driver_id = d.id " +
            "LEFT JOIN work_item wi ON wrr.work_item_id = wi.id " +
            "WHERE wr.deleted = 0 ORDER BY wr.created_at DESC")
    List<WorkRecord> selectListWithDetail();
}
