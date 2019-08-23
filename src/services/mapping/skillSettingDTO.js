import _ from 'lodash';
export const mapFromDto = function (resultAPIs) {
    let rs = []
    if (resultAPIs.length > 0) {
        resultAPIs.forEach(function (element) {
            rs.push(element.data)
        }, this);
    }
    return rs;
}
export const mapToDto = function (skillDto) {
    let newSkill = _.assign({}, skillDto)
    //newSkill.requireCertificate = false;
    return newSkill;
}