package com.farmgear.core.controller;

import com.farmgear.core.common.Result;
import com.farmgear.core.dto.LoginDTO;
import com.farmgear.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Validated @RequestBody LoginDTO loginDTO) {
        try {
            Map<String, Object> result = userService.login(loginDTO);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
