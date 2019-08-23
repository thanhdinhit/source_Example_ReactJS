export const mapFromDto = function (resultAPIs) {
    let rs = []
    if (resultAPIs.length > 0)
        resultAPIs.forEach(function (element) {
            element.value = element.value;
            element.label = element.value;
            rs.push(element);
        }, this);
    return rs;
}
export const mapToDto = function (userRoleDto) {
    return userRoleDto;
}