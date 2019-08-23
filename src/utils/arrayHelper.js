import _ from 'lodash';

export const merge = function (source1, source2) {
    let rs = []
    rs = rs.concat(source1);
    let match = false;
    for (let i = 0; i < source2.length; i++) {
        match = false;
        for (let j = 0; j < source1.length; j++) {
            if (source2[i].id == source1[j].id) {
                match = true;
                break;
            }
        }
        if (!match) rs.push(source2[i]);
    }
    return rs;
};

export const rebuildTree = function (arr) {
    let rs = []
    let tree = buildTreeFromList(arr);
    tree.forEach(element => {
        buildListFromTree(element, rs)
    });

    rs.forEach(element => {
        delete element.children;
    })

    return rs;
}

export const buildTreeFromList = function (list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent && list[map[node.parent.id]]) {
            list[map[node.parent.id]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}

export const buildListFromTree = function (node, arr) {
    if (!node) return;

    arr.push(node);
    if (node.children && node.children.length) {
        for (let i = 0; i < node.children.length; i++) {
            buildListFromTree(node.children[i], arr)
        }
    }
}

export const formatFilterFromUrl = function (filter) {
    let isEmptyParams = function (item) {
        if (_.isUndefined(item) || _.isNull(item) || item == '') {
            return true;
        }
        if (_.isArray(item) && item.length == 0) {
            return true;
        }
        if (_.isObject(item) && !_.isDate(item) && _.isEmpty(_.omitBy(item, isEmptyParams))) {
            return true;
        }
        return false;
    };

    return _.omitBy(filter, (item) => {
        return isEmptyParams(item);
    });
};

export const checkBelongParentGroups = function (group1, group2, groups) { // check group 2 is belong parents group 1
    let rs = true;
    if (group1 && group2) {
        if (group2.id == group1.id) {
            rs = true;
        }
        else {
            rs = false;
            while (group1.parent) {
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i].id == _.get(group1, 'parent.id')) {
                        if (groups[i].id == group2.id) {
                            rs = true;
                        }
                        group1 = groups[i];
                    }
                }
            }
        }
    }
    return rs;
};

export const getNearestParent = function (group, group2, groups) {
    let parents = [];
    let rs = undefined;
    if (group2 && group) {

        //get parents of group
        while (group.parent) {
            let parentGroup = _.find(groups, x => x.id == group.parent.id);
            if (parentGroup) {
                parents.push(parentGroup);
                group = parentGroup;
            }
            else {
                break;
            }
        }

        //find nearest group depends on parents 
        while (group2) {
            let nearestParent = parents.find(x => x.id == group2.id)
            if (nearestParent) {
                rs = nearestParent;
                break;
            }
            else {
                group2 = groups.find(x => x.id == group2.id);
                group2 = groups.find(x => x.id == _.get(group2, 'parent.id'));
            }
        }
    }
    return rs;
}
