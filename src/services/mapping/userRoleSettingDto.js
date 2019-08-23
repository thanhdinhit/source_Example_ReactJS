export const mapFromDto = function (resultAPIs) {
    let rs = []
    if (resultAPIs.length > 0)
        resultAPIs.forEach(function (element) {
            element = element.data;
            element.value = element.id;
            element.label = element.name;
            rs.push(element);
        }, this);
    return rs;
}
export const mapToDto = function (userRoleDto) {
    return userRoleDto;
}