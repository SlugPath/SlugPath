import { createUser } from "@/app/actions/user";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

describe("User Actions", () => {
  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  it("should create a user", async () => {
    const userId = uuidv4();

    const user = await createUser(
      {
        userId: userId,
        email: "sammy@ucsc.edu",
        name: "Sammy Slug",
      },
      [],
    );

    // Check if user returns a user
    expect(user).toBeDefined();
    expect(user).toBeDefined();
    expect(user.id).toBe(userId);
    expect(user.name).toBe("Sammy Slug");
    expect(user.email).toBe("sammy@ucsc.edu");
    expect(user.role).toBe("USER");
    expect(user.majors).toHaveLength(0);

    // Check if user exists in the database
    const userInDatabase = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        majors: true,
      },
    });

    expect(userInDatabase).toBeDefined();
    expect(userInDatabase?.id).toBe(userId);
    expect(userInDatabase?.name).toBe("Sammy Slug");
    expect(userInDatabase?.email).toBe("sammy@ucsc.edu");
    expect(userInDatabase?.role).toBe("USER");
    expect(userInDatabase?.majors).toHaveLength(0);
  });

  // TODO: Create a test for creating a user with programs, requires a server
  // action to create and delete programs in the database
});
