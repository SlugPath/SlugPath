import usePlannersStore from "@/store/planner";
import { PlannersContext } from "@contexts/PlannersProvider";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { Suspense, lazy, useContext } from "react";

import ExportSkeleton from "./ExportSkeleton";

const PlannerPDF = lazy(() => import("./PlannerPDF"));

// Create styles
export default function ExportModal() {
  const { setShowExportModal, showExportModal } = useContext(PlannersContext);

  const activePlannerId = usePlannersStore((state) => state.activePlannerId);
  const planners = usePlannersStore((state) => state.planners);

  if (activePlannerId === undefined || Object.is(activePlannerId, {}))
    return null;

  const courseState = planners.find(
    (planner) => planner.id === activePlannerId,
  );

  if (!courseState) return null;

  return (
    <Modal
      open={showExportModal}
      onClose={() => setShowExportModal(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
        sx={{
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          height: "80%",
          width: "100%",
        }}
      >
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Export to PDF
        </Typography>
        <Suspense fallback={<ExportSkeleton />}>
          <PlannerPDF
            planners={planners}
            activePlanner={activePlannerId}
            courseState={courseState}
          />
        </Suspense>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
