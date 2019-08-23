export function mapFromDtos(resultAPIs){
    let requiredDocument = []
    if(resultAPIs.length > 0){
        resultAPIs.forEach(function(element) {
            requiredDocument.push(element.data)
        }, this);
    }
    return requiredDocument
}

export function mapToDto(requiredDocument){
    return requiredDocument;
}
