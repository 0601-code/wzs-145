package com.farmgear.core.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.farmgear.core.entity.WorkRequirement;
import com.farmgear.core.mapper.WorkRequirementMapper;
import com.farmgear.core.service.WorkRequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkRequirementServiceImpl extends ServiceImpl<WorkRequirementMapper, WorkRequirement> implements WorkRequirementService {

    @Autowired
    private WorkRequirementMapper workRequirementMapper;

    @Override
    public List<WorkRequirement> listWithItem() {
        return workRequirementMapper.selectListWithItem();
    }

    @Override
    public boolean submitRequirement(WorkRequirement requirement) {
        requirement.setStatus("PENDING");
        return this.save(requirement);
    }

    @Override
    public boolean updateStatus(Long id, String status) {
        WorkRequirement requirement = new WorkRequirement();
        requirement.setId(id);
        requirement.setStatus(status);
        return this.updateById(requirement);
    }
}
