export const mapFromDto = function(rightAPIs){
    let rights = []
    if(rightAPIs && rightAPIs.length>0){
        rightAPIs.forEach(function(element) {
            rights.push(element);
        }, this);
    }
    return rights;
}