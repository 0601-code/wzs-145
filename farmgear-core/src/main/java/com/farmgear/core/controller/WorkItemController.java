package com.farmgear.core.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.farmgear.core.common.Result;
import com.farmgear.core.entity.WorkItem;
import com.farmgear.core.mapper.WorkItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work-item")
public class WorkItemController {

    @Autowired
    private WorkItemMapper workItemMapper;

    @GetMapping("/list")
    public Result<List<WorkItem>> list() {
        return Result.success(workItemMapper.selectList(
                new LambdaQueryWrapper<WorkItem>().eq(WorkItem::getDeleted, 0)
        ));
    }

    @GetMapping("/{id}")
    public Result<WorkItem> getById(@PathVariable Long id) {
        return Result.success(workItemMapper.selectById(id));
    }

    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody WorkItem workItem) {
        return Result.success(workItemMapper.insert(workItem) > 0);
    }

    @PutMapping("/update")
    public Result<Boolean> update(@RequestBody WorkItem workItem) {
        return Result.success(workItemMapper.updateById(workItem) > 0);
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(workItemMapper.deleteById(id) > 0);
    }
}
