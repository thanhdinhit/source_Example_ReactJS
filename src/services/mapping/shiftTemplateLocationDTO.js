export function mapFromDtos(resultAPIs) {
    let rs = []

    if (resultAPIs.length) {
        resultAPIs.forEach(function (shiftTemplateLocation) {
            if (!rs.find(x => x.id == shiftTemplateLocation.shiftTemplate.id))
                rs.push(shiftTemplateLocation.shiftTemplate)
        }, this);
    }

    return rs;
}