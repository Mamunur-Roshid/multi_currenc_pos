export default {
    namespaced: true,

    state: () => {
        return {
            loadingProducts: false,
            products: [],
            stock: [],
            low_stock_products: [],
            openingStock: 0,
            ledgers: []
        }
    },

    getters: {
        loadingProducts(state) {
            return state.loadingProducts;
        },
        low_stock_products(state) {
            return state.low_stock_products.map((item, sl) => {
                item.sl = sl + 1;
                item.display_text = `${item.product.code} - ${item.product.name} ${item.product.barcode ? '('+item.product.barcode+')' : ''}`;
                return item;
            });
        },

        products(state) {
            return state.products.map((item, sl) => {
                item.sl = sl + 1;
                item.display_text = `${item.code} - ${item.name}`;
                return item;
            });
        },

        stock(state) {
            return state.stock;
        },

        openingStock(state) {
            return state.openingStock;
        },

        ledgers(state) {
            return state.ledgers;
        }
    },

    mutations: {
        loadingProducts(state, isLoading) {
            state.loadingProducts = isLoading;
        },

        setProduct(state, products) {
            state.products = products;
        },
        setLowStock(state, low_stock_products) {
            state.low_stock_products = low_stock_products;
        },

        setStock(state, stock) {
            state.stock = stock;
        },

        setOpeningStock(state, stock) {
            state.openingStock = stock;
        },

        setProductLedger(state, ledgers) {
            state.ledgers = ledgers;
        }
    },

    actions: {
        async getProducts(context, payload) {
            context.commit('loadingProducts', true);

            let products = await axios.post(`${this.state.host}/get-products`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.products;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setProduct', products);

            context.commit('loadingProducts', false);
        },

        async saveProduct(context, {product, image}) {
            let isSuccess = false;

            let url = 'add-product';

            if(product.id != null) {
                url = 'update-product';
            }

            let set = new FormData();
            set.append('product', JSON.stringify(product));

            if(image != null && image != undefined) {
                set.append('image', image);
            }

            await axios.post(`${this.state.host}/${url}`, set, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getProducts');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async bulkImport(context, products) {
            let isSuccess = false;

            await axios.post(`${this.state.host}/bulk-imoprt-product`, {
                products
            }, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                // context.dispatch('getProducts');
                this.dispatch('snackbar/success', res.data.message.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },
        async bulkImportPurchase(context, products) {
            let isSuccess = false;

            await axios.post(`${this.state.host}/bulk-imoprt-purchase`, {
                products
            }, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                // context.dispatch('getProducts');
                this.dispatch('snackbar/success', res.data.message.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteProduct(context, id) {
            await axios.delete(`${this.state.host}/delete-product/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getProducts');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async generateProductCode(context) {
            let newCode = await axios.get(`${this.state.host}/generate-product-code`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.code;
            })
            .catch(error => this.dispatch('snackbar/error', error))
    
            return newCode;
        },
        
        async getCurrentStock(context, payload) {
            let stock = await axios.post(`${this.state.host}/get-current-stock`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.stock;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setStock', stock);

        },

        async getTotalStock(context, payload) {
            let stock = await axios.post(`${this.state.host}/get-total-stock`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.stock;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setStock', stock);

        },
        async getProducts(context, payload) {
            context.commit('loadingProducts', true);

            let products = await axios.post(`${this.state.host}/get-products`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.products;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setProduct', products);

            context.commit('loadingProducts', false);
        },
        async getLowStockReport(context, payload) {
            // low-stock-products
            context.commit('loadingProducts', true);
            let low_stock = await axios.post(`${this.state.host}/low-stock-products`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.products;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })
            // console.log('low_stock', Object.values(low_stock));
            context.commit('loadingProducts', false);
            context.commit('setLowStock', Object.values(low_stock));
        },

        async getProductLedger(context, payload) {
            await axios.post(`${this.state.host}/get-product-ledger`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setProductLedger', res.data.ledgers);
                context.commit('setOpeningStock', res.data.openingStock);

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })
        }
    }
}
