import {Organization, Product} from '../Models';
import {isArray} from 'lodash';

let product_routes = {};

product_routes.product_by_organization = async (req, res) => {
    try {
        let products = await Product.find({});
        let organizationName = req.params.organizationName
        let tags = req.query.tags
        let role = req.user.role
        let names = [];
        let parent;
        let filtered_products = [];
        let organization = await Organization.aggregate().match({name: organizationName}).limit(1).graphLookup({ from: 'Organization', startWith: '$name', connectFromField: 'name', connectToField: 'parent', as: 'children', maxDepth: 3 })

        if(organization[0].children.length > 1){
            organization[0].children.forEach( (child) => {
                names.push(child.name)
            })
        }else {
            names = organizationName
            parent = organization[0].parent
        }

        if(role === "junior" && organization[0].level !== 2){
            return res.status(401).json({
                message: 'You have no authorization to access this.',
                statusCode: 401
            });
        }else{
            if(role === "middle" && organization[0].level === 0){
                return res.status(401).json({
                    message: 'You have no authorization to access this.',
                    statusCode: 401
                });
            }else{
                if((role === "intern" && !organizationName.includes("STUFF A") && !parent) || (role ==="intern" && parent && !parent.includes("STUFF A"))){
                    return res.status(401).json({
                                message: 'You have no authorization to access this.',
                                statusCode: 401
                    });
                }else{
                    products.forEach((product) => {
                        if (isArray(names)){
                            if(names.includes(product.department)){
                                if(tags){
                                    if(isArray(tags)){
                                        tags.forEach((tag) => {
                                            if(product.tags.includes(tag)){
                                                filtered_products.push(product)
                                            }
                                        })
                                    }else{
                                        if(product.tags.includes(tags)){
                                            filtered_products.push(product)
                                        }
                                    }
                                }
                            }
                        }else {
                            if(product.department === names){
                                if(tags){
                                    if(isArray(tags)){
                                        tags.forEach((tag) => {
                                            if(product.tags.includes(tag)){
                                                filtered_products.push(product)
                                            }
                                        })
                                    }else{
                                        if(product.tags.includes(tags)){
                                            filtered_products.push(product)
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
        }

        return res.status(200).json({total: filtered_products.length, products: filtered_products })
    } catch (error) {
        return res.status(400).json({error});
    }
};

export { product_routes };
