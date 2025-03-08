import bcrypt from "bcrypt";
const saltRounds = 10;
export function createHashPassword(password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
export function validatePassword(password, hash) {
  return bcrypt.compare(password, hash, function (err, result) {});
}
