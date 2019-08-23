import * as ArrayHelper from '../../utils/arrayHelper'

export const mapFromDtos = function (resultAPIs) {
    let rs = [];
    if (resultAPIs.length > 0) {
        resultAPIs.forEach(function (element) {
            element = element.data;
            rs.push(element);
        }, this);
    }
    return ArrayHelper.rebuildTree(rs);
}



export const mapFromDto = function (resultAPIs) {
    let groupDto = {};
    groupDto = resultAPIs;
    return groupDto;
}

export const mapToDto = function (groupDto) {
    let newDTO = {};
    newDTO = groupDto;
    return newDTO;
}