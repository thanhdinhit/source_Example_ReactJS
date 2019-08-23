import { clone } from '../common'

export function mapFromDtos(resultAPIs) {
    resultAPIs.forEach(function (element, index) {
        if (element.data)
            resultAPIs[index] = element.data;
    }, this);
    let leaveManagement = {};
    leaveManagement.leaveTypes = []
    leaveManagement.seniority = {
        day: {},
        year: {}
    }
    leaveManagement.leaveSetting = {
        notifyApprover: {
        },
        notifyUpperManager: {
        },
        autoRejectPendingRequest: {
        }
    }
    leaveManagement.leaveBalance = {
        resetOn: {
        },
        notifyOn: {
        },
        accumulate: {
        }
    }
    if (resultAPIs.length > 0) {
        leaveManagement.leaveTypes = resultAPIs.filter(x => x.leaveConfigType == "Leave_Type");
        leaveManagement.seniority.day = resultAPIs.find(x => x.leaveConfigType == "Seniority_Type" && x.name == "Seniority Days");
        leaveManagement.seniority.year = resultAPIs.find(x => x.leaveConfigType == "Seniority_Type" && x.name == "Seniority Years");
        leaveManagement.leaveSetting.notifyApprover = resultAPIs.find(x => x.leaveConfigType == "Leave_Setting" && x.name == "Notify approver");
        leaveManagement.leaveSetting.notifyUpperManager = resultAPIs.find(x => x.leaveConfigType == "Leave_Setting" && x.name == "Notify upper manager");
        leaveManagement.leaveSetting.autoRejectPendingRequest = resultAPIs.find(x => x.leaveConfigType == "Leave_Setting" && x.name == "Auto reject pending request");
        leaveManagement.leaveBalance.resetOn = resultAPIs.find(x => x.leaveConfigType == "Leave_Balance" && x.name == "Reset on");
        if (leaveManagement.leaveBalance.resetOn) {
            leaveManagement.leaveBalance.resetOn.value = new Date(leaveManagement.leaveBalance.resetOn.value);
        }
        leaveManagement.leaveBalance.notifyOn = resultAPIs.find(x => x.leaveConfigType == "Leave_Balance" && x.name == "Notify on");
        if (leaveManagement.leaveBalance.notifyOn) {
            leaveManagement.leaveBalance.notifyOn.value = new Date(leaveManagement.leaveBalance.notifyOn.value);
        }
        leaveManagement.leaveBalance.accumulate = resultAPIs.find(x => x.leaveConfigType == "Leave_Balance" && x.name == "Accumulate");
    }
    return leaveManagement;

}

export function mapToDto(leaveManagement) {
    let newLeaveManagement = clone(leaveManagement);
    if (newLeaveManagement.length > 0) {
        let resetOn = newLeaveManagement.find(x => x.leaveConfigType == "Leave_Balance" && x.name == "Reset on");
        if (resetOn) {
            resetOn.value = ("0" + (resetOn.value.getMonth() + 1)).slice(-2) + "/" + ("0" + resetOn.value.getDate()).slice(-2);
        }
        let notifyOn = newLeaveManagement.find(x => x.leaveConfigType == "Leave_Balance" && x.name == "Notify on");
        if (notifyOn) {
            notifyOn.value = ("0" + (notifyOn.value.getMonth() + 1)).slice(-2) + "/" + ("0" + notifyOn.value.getDate()).slice(-2);
        }
    }
    return newLeaveManagement;
}
