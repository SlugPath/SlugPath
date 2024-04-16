import usePlannersStore from "@/app/hooks/usePlanners";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { Suspense, lazy, useMemo } from "react";

import ExportSkeleton from "./ExportSkeleton";

const PlannerPDF = lazy(() => import("./PlannerPDF"));

// Create styles
export default function ExportModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) {
  // Zustand store
  const { planners, activePlannerId } = usePlannersStore((state) => ({
    planners: state.planners,
    activePlannerId: state.activePlannerId,
  }));

  // TODO: cache activePlanner globally ?
  const activePlanner = useMemo(
    () => planners.find((planner) => planner.id === activePlannerId),
    [planners, activePlannerId],
  );

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
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
        {activePlanner && (
          <Suspense fallback={<ExportSkeleton />}>
            <PlannerPDF planner={activePlanner} />
          </Suspense>
        )}
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
