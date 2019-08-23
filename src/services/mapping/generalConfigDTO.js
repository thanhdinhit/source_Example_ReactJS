import * as configName from '../../constants/configName'

export function mapFromDtos(apiResults) {
    let rs = {}

    let companyName = apiResults.find(x=>x.name == configName.COMPANY_NAME)
    if(companyName) rs.name = companyName
    let companyLogo = apiResults.find(x=>x.name == configName.COMPANY_LOGO)
    if(companyLogo) rs.logo = companyLogo
    let defaultLanguage = apiResults.find(x=>x.name == configName.COMPANY_DEF_LANGUAGE)
    if(defaultLanguage) rs.defaultLanguage = defaultLanguage;
    return rs;
}