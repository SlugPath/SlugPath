import { APP_URL } from "@/config";
import { PlannersContext } from "@contexts/PlannersProvider";
import { LibraryAddCheck } from "@mui/icons-material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import {
  IconButton,
  Modal,
  ModalClose,
  Sheet,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useContext, useState } from "react";

// Create styles
export default function ShareModal() {
  const { activePlanner, showShareModal, setShowShareModal } =
    useContext(PlannersContext);

  const [open, setOpen] = useState(false);

  if (activePlanner === undefined || Object.is(activePlanner, {})) return null;

  const plannerURL = `${APP_URL}/planner/${activePlanner}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(plannerURL).then(() => setOpen(true));
  };

  return (
    <>
      <Snackbar
        open={open}
        variant="solid"
        color="primary"
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <>
          <LibraryAddCheck
            className="dark:fill-white"
            style={{ color: "black" }}
          />
          <Typography level="title-md" className="mx-auto">
            Copied planner link to clipboard!
          </Typography>
        </>
      </Snackbar>
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
            width: "25vw",
          }}
        >
          <h2 className="font-bold text-2xl mb-1 text-center">
            Share this planner
          </h2>
          <div className="my-5 flex flex-row items-center">
            <Tooltip title="Copy share planner link">
              <IconButton onClick={() => handleCopyToClipboard()}>
                <ContentCopy
                  className="dark:fill-white"
                  style={{ color: "black" }}
                />
              </IconButton>
            </Tooltip>
            <p className="ml-2 p-2 w-full rounded-lg truncate">{plannerURL}</p>
          </div>
          <ModalClose variant="plain" sx={{ m: 1 }} />
        </Sheet>
      </Modal>
    </>
  );
}
