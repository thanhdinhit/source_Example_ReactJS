import * as apiEndpoints from '../constants/apiEndpoints'
import * as routeConfig from '../constants/routeConfig'
import * as apiHelper from '../utils/apiHelper';
import * as types from '../constants/actionTypes';
import R from '../resources/resourceManager'
import * as configName from '../constants/configName'
import * as generalConfigDTO from '../services/mapping/generalConfigDTO';
import { catchError, checkError } from '../services/common';
import * as PublicService from '../services/public.service';

export function loadGeneralSetting(redirect = '/') {
  return function (dispatch) {

    PublicService.loadGeneralSetting(function (error, result, status, xhr) {
      if (error) {
        return catchError(error, dispatch, types.LOAD_GENERAL_SETTING);
      }
      let generalConfig = generalConfigDTO.mapFromDtos(result.data.generalConfigs)
      let curLanguage = localStorage.getItem('language');
      let file = undefined;
      if (!curLanguage) curLanguage = generalConfig.defaultLanguage.value;
      if (curLanguage == configName.ENGLISH) {
        file = require('../resources/languages/' + 'en');
      }
      else if (curLanguage == configName.VIETNAMESE) {
        file = require('../resources/languages/' + 'vi');
      }
      if (!file) {
        file = require('../resources/languages/' + 'en');
        curLanguage = 'en';
      }
      R.curResource = file.default;
      localStorage.setItem('language', curLanguage)

      return dispatch({
        type: types.LOAD_GENERAL_SETTING,
        generalConfig: generalConfig,
        error: checkError(result.data, xhr.status)
      })
    })
  }
}

export function changeLanguage(curLanguage) {
  let file = undefined;
  if (curLanguage == configName.ENGLISH) {
    file = require('../resources/languages/' + 'en');
  }
  else if (curLanguage == configName.VIETNAMESE) {
    file = require('../resources/languages/' + 'vi');
  }
  if (!file) {
    file = require('../resources/languages/' + 'en');
    curLanguage = 'en';
  }
  R.curResource = file.default;
  localStorage.setItem('language', curLanguage)
  return {
    type: types.CHANGE_LANGUAGE,
    curLanguage: curLanguage
  }

}