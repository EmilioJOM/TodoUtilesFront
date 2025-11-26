import { jwtDecode } from "jwt-decode";

export const makeUserFromJwt = (jwt) => {
  try {
    const { name, email, role } = jwtDecode(jwt);
    return {
      name: name || (email ? email.split("@")[0] : null),
      email,
      role,
    };
  } catch (err) {
    console.error("Error decodificando JWT:", err);
    return null;
  }
};
