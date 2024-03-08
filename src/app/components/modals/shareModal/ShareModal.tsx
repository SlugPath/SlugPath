import { APP_URL } from "@/config";
import { PlannersContext } from "@contexts/PlannersProvider";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { Button } from "@mui/joy";
import { Suspense, useContext } from "react";
import ShareIcon from '@mui/icons-material/Share';

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
          Share This Planner
        </Typography>
        <Suspense fallback={<ExportSkeleton />}>
        <div style={{ marginTop: '25px', marginBottom: '15px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '5px', top: '20%', color: '#757575' }}>
            <ShareIcon className="dark:fill-white" style={{ color: 'black' }} />
          </div>
          <input 
            type="text" 
            value={url + activePlanner} 
            readOnly 
            className="pl-10 py-2 pr-4 w-full dark:bg-slate-800 rounded border bg-gray-200 focus:bg-white focus:outline-none focus:border-blue-500 w-full"
            style={{ width: '30vw' }}
          />
        </div>
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
