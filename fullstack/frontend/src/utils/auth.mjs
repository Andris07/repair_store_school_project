/**
 * @param {{ email: string, password: string, remember: boolean }} credentials;
 */
export async function login(credentials)
{
  // TODO: login
  throw new Error(`A bejelentkezés még nincs bekötve (src/utils/auth.mjs => login).`);
}

/**
 * @param {{ name: string, email: string, phone: string|null, password: string }} payload;
 */
export async function register(payload)
{
  // TODO: registration
  throw new Error(`A regisztráció még nincs bekötve (src/utils/auth.mjs => register).`);
}
