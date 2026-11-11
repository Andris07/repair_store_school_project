const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS = /^\+?[0-9\s\-()]+$/;

const text = (value) => String(value ?? ``).trim();

export const rules =
{
  name(value)
  {
    const name = text(value);
    if (name === ``) return `Add meg a nevedet.`;
    if (name.length < 3) return `A név legalább 3 karakter legyen.`;
    return true;
  },

  email(value)
  {
    const email = text(value);
    if (email === ``) return `Add meg az e-mail címedet.`;
    if (!EMAIL.test(email)) return `Adj meg érvényes telefonszámot, pl. peter@example.com`;
    return true;
  },

  // optional field: unchecked => empty: fine, checked => empty: not fine
  phone(value)
  {
    const phone = text(value);
    if (phone === ``) return true;
    const digits = (phone.match(/\d/g) ?? []).length;
    if (!PHONE_CHARS.test(phone) || digits < 7 || digits > 15) return `Adj meg érvényes telefonszámot, pl. +36 30 123 4567.`;
    return true;
  },

  // login only checks if the input is empty or not, password rules are already applied when registering
  loginPassword(value)
  {
    return String(value ?? ``) === `` ? `Add meg a jelszavadat.` : true;
  },

  newPassword(value)
  {
    const password = String(value ?? ``);
    if (password === ``) return `Adj meg egy jelszót.`;
    if (password.length < 8) return `A jelszó legalább 8 karakter legyen.`;
    if (!/\p{L}/u.test(password) || !/\d/.test(password)) return `A jelszó tartalmazzon betűt és számot is.`;
    return true;
  },

  passwordConfirm(value, values)
  {
    if (String(value ?? ``) === ``) return `Erősítsd meg a jelszót.`;
    if (value !== values.password) return `A két jelszó nem egyezik.`;
    return true;
  }
}

export const loginSchema =
{
  email: rules.email,
  password: rules.loginPassword
}

export const registerSchema =
{
  name: rules.name,
  email: rules.email,
  phone: rules.phone,
  password: rules.newPassword,
  passwordConfirm: rules.passwordConfirm
}

export function validate(values, schema)
{
  const errors = {};

  for (const [field, rule] of Object.entries(schema))
  {
    const result = rule(values[field], values);
    if (result !== true) errors[field] = result;
  }

  return errors;
}
