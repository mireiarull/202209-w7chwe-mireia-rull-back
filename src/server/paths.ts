export const partialPaths = {
  users: {
    base: "/users",
    register: "/register",
  },
};

// PARA SUPERTEST
export const paths = {
  users: {
    register: `${partialPaths.users.base}${partialPaths.users.register}`,
  },
};
