import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    // hash the password synchronously just for the seeder
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    shippingAddress: {
      street: "1234 East West St",
      city: "AnyCity",
      state: "AnyState",
      zip: "80123",
      country: "USA",
    },
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    shippingAddress: {
      street: "1234 South St",
      city: "Denver",
      state: "CO",
      zip: "80423",
      country: "USA",
    },
  },
];

export default users;
