import userModel from "../users/user.model.js";

export const verificarUser = (req, res, next) => {
    const { email } = req.body;
    if (!email || !email.includes("@kinal.edu.gt")) {
        return res.status(400).json({ error: "El correo electrónico debe ser de la empresa." });
    }
    next();
};
