import prisma from "../db/db.config.js";
import { email, success, z } from "zod";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {
  userSchema,
  createUserSchema,
  loginSchema,
} from "../validation/userValidatoin.js";

export async function register(req, res) {
  try {
    const userData = req.body;

    const validation = createUserSchema.safeParse(userData);

    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      return res
        .status(400)
        .json({ success: false, message: "Validation Failed", error: errors });
    }
    // check user exits.
    const userExits = await prisma.users.findUnique({
      where: { email: validation.data.email },
    });

    if (userExits) {
      return res.status(400).json({
        success: false,
        message: "user already exits.",
        error: [{ message: "users already exits." }],
      });
    }

    const salt = bcrypt.genSaltSync(10);

    validation.data.password = bcrypt.hashSync(validation.data.password, salt);

    const user = await prisma.users.create({ data: validation.data });
    
    const safePayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile
    }

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      user: safePayload,
    });
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "something went wrong,please try again.",
      error: [{ message: "something went wrong." }],
    });
  }
}

export async function login(req, res) {
  try {
    const userData = req.body;

    const validation = loginSchema.safeParse(userData);

    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      return res.status(400).json({
        success: false,
        message: "all fields required.",
        error: errors,
      });
    }

    //check user

    const userExits = await prisma.users.findUnique({
      where: { email: validation.data.email },
    });

    if (!userExits) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        error: [{ message: "user not found." }],
      });
    }


    const checkPassword = await bcrypt.compareSync(
      validation.data.password,
      userExits.password
    );

    if (!checkPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "invalid email or password",
          error: [{ message: "invalid email and password." }],
        });
    }
    
    const payload = {
      id: userExits.id,
      name: userExits.name,
      email: userExits.email,
      profile: userExits.profile
    }
    
    const token = jwt.sign(payload , process.env.JWT_SECRET, {
      expiresIn: '365d'
    });

    return res
      .status(200)
      .json({ success: true, message: "logged in", token: `Bearer ${token}` });
      
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      error: [{ message: "something went wrong." }],
    });
  }
}
