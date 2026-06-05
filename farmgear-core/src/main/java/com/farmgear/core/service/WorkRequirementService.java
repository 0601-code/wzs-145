package com.farmgear.core.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.farmgear.core.entity.WorkRequirement;

import java.util.List;

public interface WorkRequirementService extends IService<WorkRequirement> {

    List<WorkRequirement> listWithItem();

    boolean submitRequirement(WorkRequirement requirement);

    boolean updateStatus(Long id, String status);
}
