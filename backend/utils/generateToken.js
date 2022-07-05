import jtw from "jsonwebtoken";
// taking in id for user id to add to payload in this token
const generateToken = (id) => {
  // return the jwt.sign() method
  return jtw.sign(
    //  pass in ID
    { id },
    // secret
    process.env.JWT_SECRET,
    // third param to set expiration on token
    {
      expiresIn: "30d",
    }
  );
};
export default generateToken;
