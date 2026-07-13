import crypto from "node:crypto";
import { ApiError } from "./errors.js";
import { readStore, updateStore } from "./store.js";

function roleKey(email) {
  return email || "_default";
}

function getRolesForEmail(email) {
  const store = readStore();
  return store.roles?.[roleKey(email)] || [];
}

export function listRoles(email) {
  return { data: { roles: getRolesForEmail(email) } };
}

export function createRole(body, session) {
  const { name, description, permissions } = body;

  if (!name?.trim()) {
    throw new ApiError("Role name is required", 400);
  }

  if (!permissions?.length) {
    throw new ApiError("Please provide permissions", 400);
  }

  const email = session?.email;
  const role = {
    _id: crypto.randomUUID(),
    name: name.trim(),
    description: description?.trim() || "",
    permissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  updateStore((store) => {
    if (!store.roles) {
      store.roles = {};
    }
    const key = roleKey(email);
    if (!store.roles[key]) {
      store.roles[key] = [];
    }
    store.roles[key].push(role);
    return store;
  });

  return {
    message: "Role created successfully",
    data: { role },
  };
}

export function updateRole(roleId, body, session) {
  const email = session?.email;
  const roles = getRolesForEmail(email);
  const index = roles.findIndex((role) => role._id === roleId);

  if (index === -1) {
    throw new ApiError("Role not found", 404);
  }

  const { name, description, permissions } = body;

  if (!name?.trim()) {
    throw new ApiError("Role name is required", 400);
  }

  const updatedRole = {
    ...roles[index],
    name: name.trim(),
    description: description?.trim() || "",
    permissions: permissions || roles[index].permissions,
    updatedAt: new Date().toISOString(),
  };

  updateStore((store) => {
    const key = roleKey(email);
    store.roles[key][index] = updatedRole;
    return store;
  });

  return {
    message: "Role updated successfully",
    data: { role: updatedRole },
  };
}

export function deleteRole(roleId, session) {
  const email = session?.email;
  const roles = getRolesForEmail(email);
  const exists = roles.some((role) => role._id === roleId);

  if (!exists) {
    throw new ApiError("Role not found", 404);
  }

  updateStore((store) => {
    const key = roleKey(email);
    store.roles[key] = store.roles[key].filter((role) => role._id !== roleId);
    return store;
  });

  return { message: "Role deleted successfully" };
}
