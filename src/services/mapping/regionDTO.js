export function mapFromDtos (resultAPIs){
    let rs = []
    if(resultAPIs.length > 0){
        resultAPIs.forEach(function(element) {
            rs.push(element.data)
        }, this);
    }
    return rs;
}