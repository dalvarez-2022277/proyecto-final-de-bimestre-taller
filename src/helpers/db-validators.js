import user from '../users/user.model.js';
export const existeEmail = async (email = '') => {
    const emailmin = email.toLowerCase();
    const existeEmail = await user.findOne({
        email: {
            $regex: new RegExp(`^${emailmin}$`, 'i')
        }
    });

    if (existeEmail) {
        throw new Error(`El correo ${email} ya esta registrado`);
    }

};