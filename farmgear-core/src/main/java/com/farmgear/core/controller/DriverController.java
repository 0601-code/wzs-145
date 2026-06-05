package com.farmgear.core.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.farmgear.core.common.Result;
import com.farmgear.core.entity.Driver;
import com.farmgear.core.mapper.DriverMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/driver")
public class DriverController {

    @Autowired
    private DriverMapper driverMapper;

    @GetMapping("/list")
    public Result<List<Driver>> list() {
        return Result.success(driverMapper.selectList(
                new LambdaQueryWrapper<Driver>().eq(Driver::getDeleted, 0)
        ));
    }

    @GetMapping("/{id}")
    public Result<Driver> getById(@PathVariable Long id) {
        return Result.success(driverMapper.selectById(id));
    }

    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody Driver driver) {
        return Result.success(driverMapper.insert(driver) > 0);
    }

    @PutMapping("/update")
    public Result<Boolean> update(@RequestBody Driver driver) {
        return Result.success(driverMapper.updateById(driver) > 0);
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(driverMapper.deleteById(id) > 0);
    }

    @GetMapping("/available")
    public Result<List<Driver>> listAvailable() {
        return Result.success(driverMapper.selectList(
                new LambdaQueryWrapper<Driver>()
                        .eq(Driver::getStatus, "AVAILABLE")
                        .eq(Driver::getDeleted, 0)
        ));
    }
}
