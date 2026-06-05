package com.farmgear.core.controller;

import com.farmgear.core.common.Result;
import com.farmgear.core.entity.WorkRequirement;
import com.farmgear.core.service.WorkRequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work-requirement")
public class WorkRequirementController {

    @Autowired
    private WorkRequirementService workRequirementService;

    @GetMapping("/list")
    public Result<List<WorkRequirement>> list() {
        return Result.success(workRequirementService.listWithItem());
    }

    @GetMapping("/{id}")
    public Result<WorkRequirement> getById(@PathVariable Long id) {
        return Result.success(workRequirementService.getById(id));
    }

    @PostMapping("/submit")
    public Result<Boolean> submit(@RequestBody WorkRequirement requirement) {
        return Result.success(workRequirementService.submitRequirement(requirement));
    }

    @PutMapping("/update")
    public Result<Boolean> update(@RequestBody WorkRequirement requirement) {
        return Result.success(workRequirementService.updateById(requirement));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(workRequirementService.removeById(id));
    }

    @PutMapping("/{id}/status")
    public Result<Boolean> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return Result.success(workRequirementService.updateStatus(id, status));
    }
}
