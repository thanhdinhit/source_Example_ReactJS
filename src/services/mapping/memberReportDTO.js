import objectAssign from 'object-assign';
export let LeaveReportDto = {
    id: 0,
    name: '',
    position: '',
    team: '',
    annualDaysAvailable: 0,
    annualDaysUsed: 0,
}


export const mapfromDto = function (resultAPI) {
    let newItemReports = [];
    resultAPI.forEach(function (element) {
        element = element.data;
        let itemReport = element;
        let newItemReport = objectAssign({}, element);
        newItemReport.id = itemReport.employee.id;
        newItemReport.name = itemReport.employee.firstName + ' ' + (itemReport.employee.lastName ? itemReport.employee.lastName : '');
        newItemReport.position = ""
        element.jobRoles.forEach(function (jobRole,index) {
            newItemReport.position += jobRole.name + (index == element.jobRoles.length  - 1? '': ', ');
        }, this);
        newItemReport.team = itemReport.team;
        newItemReport.annualDaysAvailable = itemReport.availableAnnualDays;
        newItemReport.annualDaysUsed = itemReport.usedAnnualDays;
        newItemReports.push(newItemReport);
    }, this);
    return newItemReports;
}