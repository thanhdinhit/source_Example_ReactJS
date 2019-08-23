export const mapFromDtos = function(resultAPIs){
    let rs = []
    if(resultAPIs.length > 0){
        resultAPIs.forEach(function(element) {
            element = element.data;
            rs.push(element)
        }, this);
    }
    return rs;

}

export const mapFromDto = function(resultAPIs){
    let groupDto = {};
    groupDto = resultAPIs;
    return groupDto;
}

export const mapToDto = function(groupTypeDto){
    let newDTO = {}
    newDTO = groupTypeDto;
    return newDTO;
}