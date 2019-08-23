export const mapFromDto = function(resultAPIs){
    let rs = []
    if(resultAPIs.length > 0){
        resultAPIs.forEach(function(element) {
            element = element.data;
            element.skills = '';
            if(element.jobSkills.length > 0){
                element.jobSkills.forEach(function(skill,index) {
                    element.skills += skill.name;
                    if(index < element.jobSkills.length -1 )
                        element.skills += ', ';
                }, this);
            }
            rs.push(element)
        }, this);
    }
    return rs;

}



export const mapToDto = function(jobRoleDto){
    let newJobRole = {}
    newJobRole = jobRoleDto;
    delete newJobRole.skills;
    return newJobRole;
}