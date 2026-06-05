package com.farmgear.core.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ScheduleCheckDTO {
    private Long machineId;
    private Long driverId;
    private LocalDate scheduleDate;
    private Long excludeScheduleId;
}
