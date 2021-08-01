import {Organization, Product} from '../Models';
import {isArray} from 'lodash';

let product_routes = {};
let unauthorizedError = {
    message: 'You have no authorization to access this.',
    statusCode: 401
}
product_routes.product_by_organization = async (req, res) => {
    try {
        let products = await Product.find({});
        let organizationName = req.params.organizationName
        let tags = req.query.tags
        let role = req.user.role
        let names = [];
        let parent;
        // buscando organization e seus filhos
        let organization = await Organization.aggregate().match({name: organizationName}).limit(1).graphLookup({ from: 'Organization', startWith: '$name', connectFromField: 'name', connectToField: 'parent', as: 'children', maxDepth: 3 })
        // caso tenha filhos, adicionar a name, caso contrario names será apenas uma string
        if(organization[0].children.length > 1){
            organization[0].children.forEach( (child) => {
                names.push(child.name)
            })
        }else {
            names = organizationName
            parent = organization[0].parent
        }
        // fazendo as verificações de acesso baseado no role
        if(role === "junior" && organization[0].level !== 2){
            return res.status(401).json({unauthorizedError});
        }else{
            if(role === "middle" && organization[0].level === 0){
                return res.status(401).json({unauthorizedError});
            }else{
                if((role === "intern" && !organizationName.includes("STUFF A") && !parent) || (role ==="intern" && parent && !parent.includes("STUFF A"))){
                    return res.status(401).json({unauthorizedError});
                }else{
                    // filtrando os produtos baseado no nome da organização/filhos
                    let filtered_products = [];
                    products.forEach((product) => {
                        if (isArray(names)){
                            if(names.includes(product.department)){
                                filtered_products.push(product)
                            }
                        }else {
                            if(product.department === names){
                                filtered_products.push(product)
                            }
                        }
                    })
                    products = filtered_products
                    // verificando se tem alguma tag para ser filtrada
                    if(tags){
                        let filtered_products = [];
                        products.forEach((product) => {
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
                        })
                        products = filtered_products
                    }
                }
            }
        }

        return res.status(200).json({total: products.length, products: products })
    } catch (error) {
        return res.status(400).json({error});
    }
};

export { product_routes };
