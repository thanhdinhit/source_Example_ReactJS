import { clone } from '../../services/common';
import dateHelper from '../../utils/dateHelper'
import _ from 'lodash';

export const mapFromDto = function (handsetAPI) {
    let rs = {};
    rs = handsetAPI;
    rs.receivedDate = handsetAPI.receivedDate ? new Date(handsetAPI.receivedDate) : null;
    rs.warrantyEndDate = handsetAPI.warrantyEndDate ? new Date(handsetAPI.warrantyEndDate) : null;

    handsetAPI.history.forEach(function (element) {
        element.date = element.date ? new Date(element.date) : null;
    }, this);
    
    return rs;
};

export const mapFromDtos = function (handsetAPIs) {
    let rs = [];
    handsetAPIs.forEach(function (element) {
        element.data.lastUpdatedStatusDate = new Date(element.data.lastUpdatedStatusDate);
        rs.push(mapFromDto(element.data));
    }, this);
    return rs;
};

export const mapFromEmployeeHandsetDto = function (handsetAPIs) {
    let rs = [];
    handsetAPIs.forEach(function (element) {
        element.lastUpdatedStatusDate = new Date(element.lastUpdatedStatusDate);
        rs.push(mapFromDto(element));
    }, this);
    return rs;
};

export const mapToDto = function (handsetDTO) {
    let rs = {};
    rs = clone(handsetDTO);
    _.forEach(['reportedDate', 'lastUpdatedStatusDate', 'warrantyEndDate', 'receivedDate'], item => {
        rs[item] = dateHelper.localToUTC(rs[item]);
    });

    rs.history.forEach(function (item) {
        item.date = dateHelper.localToUTC(item.date);
    }, this);

    return rs;
};

export const mapFromHandsetSummaryDTO = function (typesDTO) {
    let rs = _.map(typesDTO, function (item) {
        return item.data;
    });
    return rs;
};

export const mapFromHandsetDTO = function (handsetDTO) {
    handsetDTO.warrantyEndDate = new Date(handsetDTO.warrantyEndDate);
    _.forEach(handsetDTO.history, item => {
        item.date = new Date(item.date);
    });
    return handsetDTO;
};

export const mapFromStoreLocDtos = function (storeLocDtos) {
    return _.map(storeLocDtos, function (item) {
        return item.data;
    });
};