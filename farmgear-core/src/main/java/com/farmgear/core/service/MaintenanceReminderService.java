package com.farmgear.core.service;

import com.farmgear.core.entity.Machine;
import java.util.List;

public interface MaintenanceReminderService {

    List<Machine> getMachinesNeedingMaintenance();

    boolean needsMaintenance(Machine machine);

    int getRemainingHours(Machine machine);

    MaintenanceInfo getMaintenanceInfo(Long machineId);

    class MaintenanceInfo {
        private Long machineId;
        private String machineName;
        private String machineNo;
        private int totalHours;
        private int maintenanceCycleHours;
        private int lastMaintenanceHours;
        private int hoursSinceLastMaintenance;
        private int remainingHours;
        private boolean needsMaintenance;
        private String maintenanceStatus;

        public Long getMachineId() {
            return machineId;
        }

        public void setMachineId(Long machineId) {
            this.machineId = machineId;
        }

        public String getMachineName() {
            return machineName;
        }

        public void setMachineName(String machineName) {
            this.machineName = machineName;
        }

        public String getMachineNo() {
            return machineNo;
        }

        public void setMachineNo(String machineNo) {
            this.machineNo = machineNo;
        }

        public int getTotalHours() {
            return totalHours;
        }

        public void setTotalHours(int totalHours) {
            this.totalHours = totalHours;
        }

        public int getMaintenanceCycleHours() {
            return maintenanceCycleHours;
        }

        public void setMaintenanceCycleHours(int maintenanceCycleHours) {
            this.maintenanceCycleHours = maintenanceCycleHours;
        }

        public int getLastMaintenanceHours() {
            return lastMaintenanceHours;
        }

        public void setLastMaintenanceHours(int lastMaintenanceHours) {
            this.lastMaintenanceHours = lastMaintenanceHours;
        }

        public int getHoursSinceLastMaintenance() {
            return hoursSinceLastMaintenance;
        }

        public void setHoursSinceLastMaintenance(int hoursSinceLastMaintenance) {
            this.hoursSinceLastMaintenance = hoursSinceLastMaintenance;
        }

        public int getRemainingHours() {
            return remainingHours;
        }

        public void setRemainingHours(int remainingHours) {
            this.remainingHours = remainingHours;
        }

        public boolean isNeedsMaintenance() {
            return needsMaintenance;
        }

        public void setNeedsMaintenance(boolean needsMaintenance) {
            this.needsMaintenance = needsMaintenance;
        }

        public String getMaintenanceStatus() {
            return maintenanceStatus;
        }

        public void setMaintenanceStatus(String maintenanceStatus) {
            this.maintenanceStatus = maintenanceStatus;
        }
    }
}
