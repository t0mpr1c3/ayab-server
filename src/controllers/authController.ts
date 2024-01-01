import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';

import { dataSource } from '../data-source';
import config from '../config/config';
import { User } from '../entity/User';

class AuthController {
  static login = async (req: Request, res: Response) => {
    // Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    // Get user from database
    const userRepository = dataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    // Check if encrypted password match
    if (!user.isUnencryptedPasswordValid(password)) {
      res.status(401).send();
      return;
    }

    // Sign JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // Send JWT in the response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = dataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    // Check if old password matches
    if (!user.isUnencryptedPasswordValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    // Validate model (password length)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // Hash the new password and save
    user.encryptPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;