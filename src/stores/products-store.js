import { defineStore } from "pinia";

// Data naming convention:
//     product: a unique smart home product model released by a company.
//     device: a device within a user's home setup.
//             In a setup there can be multiple devices which are the same product (same productId but different localId).
import productsFile from "/resources/products/packed/PackedJSONs.json";

export const useProductsStore = defineStore("products", {
    state() {
        return {
            allProducts: null,
            allBrands: null
        };
    },

    actions: {
        initStore() {
            this.initAllProducts();
            this.initAllBrands();
        },

        initAllProducts() {
            const allProducts = {};
            const brokenProducts = [];

            for (const productId in productsFile.data) {
                const product = productsFile.data[productId];

                if (!product || !product.brand || !product.model || !product.category || !product.network || !product.productId) {
                    if (product) {
                        brokenProducts.push(product);
                    }
                    continue;
                }

                if (!Array.isArray(product.control)) {
                    product.control = [];
                }
                if (!Array.isArray(product.powerSource)) {
                    product.powerSource = [];
                }
                if (product.generation == null && !product.revision) {
                    product.generation = 1;
                    product.revision = "N/A";
                }

                allProducts[product.productId] = product;
            }

            this.allProducts = allProducts;
            if (brokenProducts.length > 0) {
                console.error(brokenProducts.length, "broken product definitions found:", brokenProducts);
            }
        },

        initAllBrands() {
            const brands = [];

            for (const productId in this.allProducts) {
                if (!brands.includes(this.allProducts[productId].brand)) {
                    brands.push(this.allProducts[productId].brand);
                }
            }

            this.allBrands = brands;
        }
    }
});
