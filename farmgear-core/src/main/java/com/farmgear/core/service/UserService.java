package com.farmgear.core.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.farmgear.core.dto.LoginDTO;
import com.farmgear.core.entity.User;

import java.util.Map;

public interface UserService extends IService<User> {

    Map<String, Object> login(LoginDTO loginDTO);

    User getByUsername(String username);
}
