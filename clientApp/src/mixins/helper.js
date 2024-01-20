import _ from 'lodash'
import fuse from 'fuse.js'

_.mixin({
    deep: function (obj, mapper) {
        return mapper(_.mapValues(obj, function (v) {
            return _.isPlainObject(v) ? _.deep(v, mapper) : v;
        }));
    },
}); 

let loginInfo = {};

if (localStorage.getItem("userData")) {
    loginInfo = JSON.parse(localStorage.getItem("userData"))
}

export default {
    data: function(){
        return {
            lodash: _,
            loginInfo: loginInfo,
            globalFilter: function (filterableItem, term, display_text) {
                const fuseOptions = {
                    isCaseSensitive: false,
                    includeScore:false,
                    useExtendedSearch: true,
                    shouldSort:true,
                    findAllMatches: true,
                    ignoreLocation: true,
                    threshold: 0,
                    keys: ['name','code','description','brand.name','category.name'],
                }
                const fuseObj = new fuse([filterableItem], fuseOptions)
                const op = fuseObj.search(term).map(item => item.item)
                if (op.length > 0) {
                    return true
                }
                return false
            },
        }
    },
    methods: {}
}