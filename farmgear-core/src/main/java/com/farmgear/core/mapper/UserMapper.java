package com.farmgear.core.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.farmgear.core.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
