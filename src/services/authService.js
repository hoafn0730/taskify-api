import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '~/models';
import { JwtProvider } from '~/providers/JwtProvider';
import ApiError from '~/utils/ApiError';
const salt = bcrypt.genSaltSync(10);

const doHashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
};

const checkEmailExist = async (email) => {
    const user = await db.User.findOne({ where: { email: email } });

    return !!user;
};

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
};

const signIn = async (data) => {
    const user = await db.User.findOne({ where: { email: data.email }, raw: true });

    if (!user || !checkPassword(data.password, user.password)) {
        throw new ApiError(400, 'Email/Password is incorrect!');
    }
    delete user.password;
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    const accessToken = JwtProvider.createToken(payload);
    const refreshToken = uuidv4();

    return {
        ...user,
        accessToken,
        refreshToken,
    };
};

const signUp = async (data) => {
    const isEmailExist = await checkEmailExist(data.email);
    if (isEmailExist) {
        throw new ApiError(400, 'Email is already exist!');
    }
    const hashPassword = doHashPassword(data.password);

    const user = await db.User.create({
        uid: uuidv4(),
        email: data.email,
        username: data.username,
        password: hashPassword,
        fullName: data.username,
        type: 'LOCAL',
    });

    return user;
};

const updateUserCode = async (type, email, token) => {
    try {
        await db.User.update(
            { code: token },
            {
                where: { email, type },
            },
        );
    } catch (error) {
        throw error;
    }
};

const verifyAccount = async (type, email, token) => {
    try {
        //
    } catch (error) {
        throw error;
    }
};

export const authService = { signIn, signUp, updateUserCode, verifyAccount };
