package com.farmgear.core.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.farmgear.core.entity.WorkRequirement;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface WorkRequirementMapper extends BaseMapper<WorkRequirement> {

    @Select("SELECT wr.*, wi.item_name as work_item_name, wi.unit_price FROM work_requirement wr " +
            "LEFT JOIN work_item wi ON wr.work_item_id = wi.id WHERE wr.deleted = 0 ORDER BY wr.created_at DESC")
    List<WorkRequirement> selectListWithItem();
}
