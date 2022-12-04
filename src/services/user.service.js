import { API_URL } from '../config';

export async function getUsers(pageNumber, pageSize) {
  const res = await fetch(`${API_URL}/users?page=${pageNumber}&per_page=${pageSize}`);
    return res;
}

export async function getUserById(id) {
  const res = await fetch(`${API_URL}/users/${id}`);
    return res;
}