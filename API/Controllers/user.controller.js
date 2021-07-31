import { User } from '../Models';
import jwt from 'jsonwebtoken';

let user_routes = {};

user_routes.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const userFound = await User.findOne({email: email})
        if (userFound) {
            if(password === userFound.password) {
                let role = userFound.roles[0]
                const token = jwt.sign(
                    {
                        email: userFound.email,
                        role: role,
                        userId: userFound.userId,
                    },
                    process.env.JWT ? process.env.JWT : 'testSecret',
                );
                res.status(201).json({token: token, status: 201})
            }else{
                res.status(401).json({message: 'Wrong credentials.', status: 401})
            }
        }else{
            res.status(401).json({message: 'User not found.', status: 401})
        }
    } catch (error) {
        return res.status(400).json({error});
    }
};

export { user_routes };
