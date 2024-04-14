import { ModalsContext } from "@/app/contexts/ModalsProvider";
import {
  useAddNewPlannerMutation,
  useUserPrograms,
} from "@/app/hooks/reactQuery";
import SelectBox from "@/app/register/(skipSetup)/SelectBox";
import { initialPlanner } from "@/lib/plannerUtils";
import { AutoAwesome, Map } from "@mui/icons-material";
import { Modal, Sheet, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

import ContinueButton from "../../buttons/ContinueButton";

/**
 * NewPlannerModal is opened when users click to add a new planner.
 * Here they can choose to add a new empty planner, or navigate to
 * the curriculum-select page to choose a planner
 */
export default function NewPlannerModal() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { showNewPlannerModal, setShowNewPlannerModal } =
    useContext(ModalsContext);
  const router = useRouter();

  const [chooseCurriculum, setChooseCurriculum] = useState(true);

  const { mutate: addNewPlannerMutation } = useAddNewPlannerMutation(userId);
  const { data: programs } = useUserPrograms(userId);

  function handleClickContinue() {
    if (chooseCurriculum) {
      router.push("/curriculum-select");
    } else {
      addNewPlannerMutation({ userId, planner: initialPlanner() });
      setShowNewPlannerModal(false);
    }
  }

  return (
    <Modal
      open={showNewPlannerModal}
      onClose={() => setShowNewPlannerModal(false)}
      className="flex justify-center"
    >
      <Sheet
        sx={{
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          height: "50%",
          width: "50%",
        }}
        className="space-y-2"
      >
        <Typography level="h3">New Planner</Typography>
        {programs && programs.length == 0 ? (
          <div className="flex flex-row items-center">
            <p className="text-subtext">
              You must choose a major to choose a prefilled planner.
            </p>
          </div>
        ) : (
          <SelectBox
            selected={chooseCurriculum == true}
            setSelected={() => setChooseCurriculum(true)}
          >
            <div className="flex gap-3">
              <div className="border-gray-300 border-2 rounded-lg p-2 h-fit w-fit">
                <Map className="h-6 w-auto" sx={{ color: "#000" }} />
              </div>
              <div>
                <p className="font-bold">Prefilled planners</p>
                <p className="text-subtext">Choose a base to build on top of</p>
              </div>
            </div>
          </SelectBox>
        )}

        <SelectBox
          selected={chooseCurriculum == false}
          setSelected={() => setChooseCurriculum(false)}
        >
          <div className="flex gap-3">
            <div className="border-gray-300 border-2 rounded-lg p-2 h-fit w-fit">
              <AutoAwesome className="h-6 w-auto" sx={{ color: "#000" }} />
            </div>
            <div>
              <p className="font-bold">Blank Planner</p>
              <p className="text-subtext">Get started with a blank planner</p>
            </div>
          </div>
        </SelectBox>

        <ContinueButton onClick={handleClickContinue}>Continue</ContinueButton>
      </Sheet>
    </Modal>
  );
}
