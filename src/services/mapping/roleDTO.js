import { clone } from '../../services/common';
export const mapFromDto = function(roleAPI){
    let rs = {}
    rs = roleAPI;
    return rs;
}
export const mapFromDtos = function(roleAPIs){
    let rs = []
    roleAPIs.forEach(function(element) {
        rs.push(element.data)
    }, this);
    return rs;
}
export const mapToDto = function(roleDTO){
    let rs = {}
    rs = clone(roleDTO);
    return rs;
}