import { APP_URL } from "@/config";
import { PlannersContext } from "@contexts/PlannersProvider";
import ContentCopy from "@mui/icons-material/ContentCopy";
import {
  IconButton,
  Modal,
  ModalClose,
  Sheet,
  Snackbar,
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
        <Typography level="title-md" className="mx-auto">
          Copied share planner link to clipboard!
        </Typography>
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
            width: "32vw",
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
          <div className="my-5 flex flex-row items-center">
            <IconButton onClick={() => handleCopyToClipboard()}>
              <ContentCopy
                className="dark:fill-white"
                style={{ color: "black" }}
              />
            </IconButton>
            <Typography
              variant="soft"
              className="ml-2 p-2 w-full rounded-lg bg-black"
            >
              {plannerURL}
            </Typography>
          </div>
          <ModalClose variant="plain" sx={{ m: 1 }} />
        </Sheet>
      </Modal>
    </>
  );
}
