import { PlannersContext } from "@contexts/PlannersProvider";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { Suspense, lazy, useContext } from "react";

import ExportSkeleton from "./ExportSkeleton";

const PlannerPDF = lazy(() => import("./PlannerPDF"));

// Create styles
export default function ExportModal() {
  const {
    planners,
    activePlanner,
    setShowExportModal,
    showExportModal,
    getPlanner,
  } = useContext(PlannersContext);
  if (activePlanner === undefined || Object.is(activePlanner, {})) return null;
  console.log(`In ExportModal, activePlanner: ${activePlanner}`);

  const courseState = getPlanner(activePlanner);

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
            activePlanner={activePlanner}
            courseState={courseState}
          />
        </Suspense>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
