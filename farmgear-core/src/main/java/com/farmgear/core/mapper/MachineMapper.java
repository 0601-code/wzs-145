package com.farmgear.core.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.farmgear.core.entity.Machine;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface MachineMapper extends BaseMapper<Machine> {

    @Select("SELECT m.*, mt.type_name FROM machine m LEFT JOIN machine_type mt ON m.type_id = mt.id WHERE m.deleted = 0")
    List<Machine> selectListWithType();
}
