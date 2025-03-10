import bcrypt from "bcrypt";
const saltRounds = 10;

export function validatePassword(password, hash) {
  return bcrypt.compareSync(password, hash, function (err, result) {});
}

export function createHashPassword(password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
