import { db } from "../data/db";
import { createSalt, hashPassword } from "../lib/security";
import { createId, getDeviceId } from "../lib/utils";
import type { AppUser, EmployeeFormValues } from "../types";

const stamp = () => ({
  updatedAt: new Date().toISOString(),
  syncStatus: "pending" as const,
  deviceId: getDeviceId()
});

export const userRepository = {
  async list() {
    const users = await db.users.toArray();
    return users.sort((a, b) => a.displayName.localeCompare(b.displayName));
  },

  async findByUsername(username: string) {
    return db.users.where("username").equals(username.trim()).first();
  },

  async create(values: EmployeeFormValues) {
    const existing = await this.findByUsername(values.username);

    if (existing) {
      throw new Error("Username already exists");
    }

    const salt = createSalt();
    const now = new Date().toISOString();
    const user: AppUser = {
      id: createId("user"),
      username: values.username.trim(),
      displayName: values.displayName.trim(),
      role: values.role,
      passwordSalt: salt,
      passwordHash: await hashPassword(values.password, salt),
      active: true,
      createdAt: now,
      ...stamp()
    };

    await db.users.add(user);
    return user;
  },

  async setActive(userId: string, active: boolean) {
    await db.users.update(userId, {
      active,
      ...stamp()
    });
  }
};
