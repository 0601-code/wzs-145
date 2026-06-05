package com.farmgear.core.service;

import com.farmgear.core.dto.ScheduleCheckDTO;

public interface ScheduleConflictService {

    boolean checkMachineConflict(Long machineId, java.time.LocalDate scheduleDate, Long excludeScheduleId);

    boolean checkDriverConflict(Long driverId, java.time.LocalDate scheduleDate, Long excludeScheduleId);

    ScheduleConflictResult checkScheduleConflict(ScheduleCheckDTO checkDTO);

    class ScheduleConflictResult {
        private boolean hasConflict;
        private String conflictType;
        private String message;

        public ScheduleConflictResult() {}

        public ScheduleConflictResult(boolean hasConflict, String conflictType, String message) {
            this.hasConflict = hasConflict;
            this.conflictType = conflictType;
            this.message = message;
        }

        public boolean isHasConflict() {
            return hasConflict;
        }

        public void setHasConflict(boolean hasConflict) {
            this.hasConflict = hasConflict;
        }

        public String getConflictType() {
            return conflictType;
        }

        public void setConflictType(String conflictType) {
            this.conflictType = conflictType;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public static ScheduleConflictResult noConflict() {
            return new ScheduleConflictResult(false, null, null);
        }

        public static ScheduleConflictResult machineConflict(String message) {
            return new ScheduleConflictResult(true, "MACHINE", message);
        }

        public static ScheduleConflictResult driverConflict(String message) {
            return new ScheduleConflictResult(true, "DRIVER", message);
        }
    }
}
