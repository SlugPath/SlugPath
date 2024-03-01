import { APP_URL } from "@/config";
import { PlannersContext } from "@contexts/PlannersProvider";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { Button } from "@mui/joy";
import { Suspense, useContext } from "react";

import ExportSkeleton from "./ExportSkeleton";

const url = `${APP_URL}/planner/`;

const copyButtonStyle = {
  // backgroundColor: 'yellow',
  marginTop: "15px",
  // padding: '10px 20px',
  // borderRadius: '20px',
  transition: "background-color 0.3s ease",
};

// Create styles
export default function ShareModal() {
  const { activePlanner, showShareModal, setShowShareModal } =
    useContext(PlannersContext);

  if (activePlanner === undefined || Object.is(activePlanner, {})) return null;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(`${url}${activePlanner}`)
      .then(() => {
        console.log("Text copied to clipboard:", activePlanner);
        // You can add a success message or perform other actions here
      })
      .catch((error) => {
        console.error("Error copying text to clipboard:", error);
        // You can add an error message or handle the error here
      });
  };

  return (
    <Modal
      open={showShareModal}
      onClose={() => setShowShareModal(false)}
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
          height: "auto",
          width: "auto",
        }}
      >
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
          textAlign={"center"}
        >
          Share Code
        </Typography>
        <Suspense fallback={<ExportSkeleton />}>
          <h1 style={{ marginTop: "20px" }}>
            <a href={`${activePlanner}`}>{`${url}${activePlanner}`}</a>
          </h1>
          <Button
            variant="solid"
            color="primary"
            onClick={handleCopyToClipboard}
            style={copyButtonStyle}
          >
            Copy to Clipboard
          </Button>
        </Suspense>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
