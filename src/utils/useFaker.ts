import { faker } from "@faker-js/faker";

const fakerUtils = () => ({
  avatar: faker.image.avatar(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
});

export default fakerUtils;
