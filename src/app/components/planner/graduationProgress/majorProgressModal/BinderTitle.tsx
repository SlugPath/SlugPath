import { RequirementList } from "@/app/types/Requirements";
import { getBinderValue } from "@/lib/requirementsUtils";

export default function BinderTitle(requirements: RequirementList): string {
  const binderValue = getBinderValue(requirements);

  if (binderValue === "0") {
    return "All of the following";
  } else {
    return `${binderValue} of the following`;
  }
}
