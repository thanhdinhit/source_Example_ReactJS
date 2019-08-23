export const mapFromDtos = function(resultAPIs){
    let rs = [];
    if(resultAPIs.length > 0){
        resultAPIs.forEach(function(element) {
            element = element.data;
            rs.push(element);
        }, this);
    }
    return rs;
}

export const mapFromDto = function(resultAPIs){
    let geographicDto = {};
    geographicDto = resultAPIs;
    return geographicDto;
}

export const mapToDto = function(geographicDto){
    let newDTO = {};
    newDTO = geographicDto;
    return newDTO; 
}