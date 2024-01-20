export default {
    data() {
        return {
            regMobile: /^01[13-9][\d]{8}$/,
            regEmail: /^[\w][\w\.\-]{1,}[\w]@[\w][\w\.\-]{1,}[\w]\.[a-zA-Z]{2,}$/
        }
    },
    
    computed: {
        validatePassword() {
            return {
                length: value => value.length > 5 || 'Password must be at least 6 characters long'
            }
        },
    },
    filters: {
        booleanToText(value) {
            return value == true ? 'Yes' : 'No';
        }
    },
    methods: {
        validateMobile(mobile) {
            if(mobile == null || mobile == '') return true;
            return this.regMobile.test(mobile);
        }, 
        
        validateEmail(email) {
            if(email == null || email == '') return true;
            if(email.indexOf('..') > -1 || email.indexOf('.-') > -1 || email.indexOf('-.') > -1 || email.indexOf('--') > -1) return false;
            return this.regEmail.test(email);
        },

        validateMobileAndEmail(mobileOrEmail) {
            if(this.validateMobile(mobileOrEmail) || this.validateEmail(mobileOrEmail)) return true;
            return false;
        },

        makeNestedMenu(menuItems, access) {
            let nestedMenu = [];
            
            menuItems.forEach(item => {
                let menuItem = Object.assign({}, item)

                if (menuItem.children == undefined) {
                    let checkMenuItem = JSON.parse(access).findIndex(item => item.link == menuItem.link)
                    
                    if (checkMenuItem > -1) nestedMenu.push(menuItem)
                } else {
                    menuItem.children = this.makeNestedMenu(menuItem.children, access)
                    if (menuItem.children.length) nestedMenu.push(menuItem)
                }
            });
            
            return nestedMenu
        },

        camelPad(str){ 
			return str
			// Look for long acronyms and filter out the last letter
			.replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
			// Look for lower-case letters followed by upper-case letters
			.replace(/([a-z\d])([A-Z])/g, '$1 $2')
			// Look for lower-case letters followed by numbers
			.replace(/([a-zA-Z])(\d)/g, '$1 $2')
			.replace(/^./, function(str){ return str.toUpperCase(); })
			// Remove any white space left around the word
			.trim();
		},
    }
}