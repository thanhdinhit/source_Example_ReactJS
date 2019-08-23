import { LOADING_INDICATOR } from '../core/common/constants';

export function showAppLoadingIndicator() {
    $('#' + LOADING_INDICATOR.APP_LOADING_INDICATOR).css('display', 'block');
}

export function hideAppLoadingIndicator(noCheckKeys) {
    if (noCheckKeys) {
        $('#' + LOADING_INDICATOR.APP_LOADING_INDICATOR).css('display', 'none');
    } else if (_.isEmpty(global.indicatorKeys)) {
        $('#' + LOADING_INDICATOR.APP_LOADING_INDICATOR).css('display', 'none');
    }
}

export function showElementLoadingIndicator(id) {
    let divId = id ? id : LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR;
    $('#' + divId).show();
}

export function hideElementLoadingIndicator(id) {
    let divId = id ? id : LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR;
    $('#' + divId).hide();
}

