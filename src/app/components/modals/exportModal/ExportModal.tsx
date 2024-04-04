import { usePlanners } from "@/app/hooks/reactQuery";
import useModalStore from "@/store/modal";
import useActivePlannerStore from "@/store/planners";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { Suspense, lazy } from "react";

import ExportSkeleton from "./ExportSkeleton";

const PlannerPDF = lazy(() => import("./PlannerPDF"));

// Create styles
export default function ExportModal() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data: planners } = usePlanners(userId);
  const activePlannerId = useActivePlannerStore(
    (state) => state.activePlannerId,
  );

  const activePlanner = planners?.find(
    (planner) => planner.id === activePlannerId,
  );

  const setShowExportModal = useModalStore((state) => state.setShowExportModal);
  const showExportModal = useModalStore((state) => state.showExportModal);

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
