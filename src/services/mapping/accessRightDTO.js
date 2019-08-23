export const mapFromDtos = function(accessRightAPIs){
    let rs = []
    accessRightAPIs.forEach(function(element) {
        rs.push(element.data)
    }, this);

    let groups = [];
    while(rs.length > 0){
        let groupRight = rs[0].groupRight;
        let group = rs.filter(x=>x.groupRight == groupRight);
        groups.push(group);
        for(let i = 0 ; i < rs.length; i++){
            if( rs[i].groupRight == groupRight){
                rs.splice(i,1);
                i--;
            }
        }
    }

    let size = 3;
    let finalRs = []
    while (groups.length > 0){
        finalRs.push(groups.splice(0, size))
    }
    return finalRs;
}
