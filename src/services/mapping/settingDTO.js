export default class settingMap {
  static mapFromLeaveSettingDto(leaveSettings) {

    let result = {};

    result.leaveType = leaveSettings.filter(x=>x.type=='Leave' && x.subType != 'Sick' && x.subType != 'Long Service Leave');
    result.remindType = leaveSettings.filter(x=>x.type == 'Remind');
    result.escalateType = leaveSettings.filter(x=>x.type == 'Escalate');
    result.truncateType = leaveSettings.filter(x=>x.type == 'Truncate');
    result.sick = leaveSettings.filter(x=>x.subType == 'Sick');
    result.longServiceLeave = leaveSettings.filter(x=>x.subType == 'Long Service Leave');
    
    return result;
  }

  static mapToLeaveSettingDto(leaveSettings) {
    let result = [];
    result = result.concat(leaveSettings.leaveType)
    result = result.concat(leaveSettings.remindType)
    result = result.concat(leaveSettings.escalateType)
    result = result.concat(leaveSettings.truncateType)
    result = result.concat(leaveSettings.sick)
    result = result.concat(leaveSettings.longServiceLeave)
    return result;
   
  }
}

