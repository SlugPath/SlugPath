import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { useContext } from "react";
import IsSatisfiedMark from "../../IsSatisfiedMark";

export default function MajorProgress() {
  const { majorIsVerified } = useContext(MajorVerificationContext);

  return (
    <div className="flex justify-between">
      <div className="flex-initial">
        <h2 className="text-2xl font-medium">Major Progress</h2>
      </div>
      <div className="flex flex-row items-center gap-1">
        <IsSatisfiedMark isSatisfied={majorIsVerified} />
        {majorIsVerified ? "Verified" : "Incomplete"}
      </div>
    </div>
  );
}
