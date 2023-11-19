import prisma from "@/lib/prisma";
// import { Label, LabelInput } from "./schema";
import { Label } from "./schema";
import { LabelColor } from "@prisma/client";
// import { StoredCourse } from "@/app/types/Course";
// import { emptyPlanner } from "@/lib/initialPlanner";
// import { Course, Prisma, Term } from "@prisma/client";

export class LabelService {
  // public async getLabels({ userId }: LabelInput): Promise<Label[]> {
  public async getLabels(userId: string): Promise<Label[]> {
    const labelsExist = await prisma.label.findMany({
      where: {
        userId,
      },
    });

    async function createDefaultLabels() {
      const colors = Object.values(LabelColor);
      const labels = [];
      for (const color of colors) {
        const newLabel = await prisma.label.create({
          data: {
            name: "",
            color,
            userId,
          },
        });
        labels.push(newLabel);
      }
      return labels;
    }

    if (labelsExist.length > 0) {
      return labelsExist;
    } else {
      return await createDefaultLabels();
    }
  }
}
