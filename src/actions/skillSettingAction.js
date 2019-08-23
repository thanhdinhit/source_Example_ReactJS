import * as types from '../constants/actionTypes';
import { catchError, checkError, getParams } from '../services/common';
import { mapFromDto, mapToDto } from '../services/mapping/skillSettingDto';
// import settingDto from '../services/mapping/settingDto';
import { loading } from './globalAction'
import * as apiHelper from '../utils/apiHelper';
import * as apiEndpoints from '../constants/apiEndpoints';
import stringUtil from '../utils/stringUtil';
import * as JobSkillService from '../services/jobSkill.service';

export function loadSkillsSetting(queryString, redirect = '/') {
    return function (dispatch) {
        //   url:  API_URL +  SETTING + 'skills?' + query,
        const params = getParams(queryString)
        params.name = queryString.name ? '%' + queryString.name : undefined;

        JobSkillService.searchJobSkills(params, function (error, result, status, xhr) {
            if (error) {
                return catchError(error, dispatch, types.LOAD_SKILLS_SETTING, redirect)
            }
            error = checkError(result, xhr.status);
            let skills = mapFromDto(result.items)
            return dispatch({
                type: types.LOAD_SKILLS_SETTING,
                skills,
                error
            });
        })
    }
}

export function addSkillsSetting(skillDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'skills?' + query,
        let skill = mapToDto(skillDto)
        $.ajax({
            url: apiEndpoints.JOBSKILL_POST,
            method: 'post',
            dataType: 'json',
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            data: JSON.stringify(skill),
            success: function (data, status, xhr) {
                dispatch(loadSkillsSetting(queryString, redirect))
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.ADD_SKILL_SETTING,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.ADD_SKILL_SETTING, redirect)
            }
        });
    }
}

export function editSkillsSetting(skillDto, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'skills?' + query,
        let skill = mapToDto(skillDto)
        $.ajax({
            url: stringUtil.format(apiEndpoints.JOBSKILL_GET_PUT_DEL, skill.id),
            method: 'put',
            dataType: 'json',
            contentType: "application/json",
            headers: apiHelper.getHeader(),
            data: JSON.stringify(skill),
            success: function (data, status, xhr) {
                dispatch(loadSkillsSetting(queryString, redirect))
                let error = checkError(data, xhr.status);
                return dispatch({
                    type: types.EDIT_SKILL_SETTING,
                    error: error
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.EDIT_SKILL_SETTING, redirect)
            }
        });
    }
}

export function deleteSkillsSetting(skill, queryString, redirect = '/') {
    return function (dispatch) {
        dispatch(loading())
        //   url:  API_URL +  SETTING + 'skills?' + query,
        $.ajax({
            url: stringUtil.format(apiEndpoints.JOBSKILL_GET_PUT_DEL, skill.id),
            method: 'delete',
            headers: apiHelper.getHeader(),
            dataType: 'json',
            contentType: "application/json",
            success: function (data, status, xhr) {
                dispatch(loadSkillsSetting(queryString, redirect))
                return dispatch({
                    type: types.DELETE_SKILL_SETTING,
                });
            },
            error: function (xhr) {
                return catchError(xhr, dispatch, types.DELETE_SKILL_SETTING, redirect)
            }
        });
    }
}