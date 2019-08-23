export function mapFromDtos (resultAPIs){
    let rs = []
    resultAPIs.forEach(function(element) {
        rs.push(element.data)
    }, this);
    return rs;
}