import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { User } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class UserService {
  static async createUser(name: string, email: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), passwordHash]
    );

    return {
      id: result.insertId,
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash
    };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    if (rows.length === 0) return null;
    return rows[0] as User;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0] as User;
  }

  static async verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }
}
