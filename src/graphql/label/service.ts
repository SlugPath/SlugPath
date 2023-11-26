import prisma from "@/lib/prisma";
import { Label } from "./schema";
import { LabelColor } from "@prisma/client";

export class LabelService {
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

  public async updateLabels(userId: string, labels: Label[]): Promise<void> {
    const operations = [];
    for (const label of labels) {
      operations.push(
        prisma.label.update({
          where: {
            id: label.id,
            userId,
          },
          data: {
            name: label.name,
            color: label.color as LabelColor,
          },
        }),
      );
    }
    await prisma.$transaction(operations);
  }
}
