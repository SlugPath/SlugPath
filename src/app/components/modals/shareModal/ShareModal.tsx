import { APP_URL } from "@/config";
import { PlannersContext } from "@contexts/PlannersProvider";
import ShareIcon from "@mui/icons-material/Share";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useContext } from "react";

const url = `${APP_URL}/planner/`;

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
        <div
          style={{
            marginTop: "25px",
            marginBottom: "15px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "5px",
                top: "20%",
                color: "#757575",
              }}
            >
              <ShareIcon
                className="dark:fill-white"
                style={{ color: "black" }}
              />
            </div>
            <input
              type="text"
              value={url + activePlanner}
              readOnly
              className="w-full pl-10 py-2 pr-4 w-full dark:bg-slate-800 rounded border bg-gray-200 focus:bg-white focus:outline-none focus:border-blue-500"
              // style={{ width: '30vw' }}
            />
          </div>
        </div>

        <button
          onClick={handleCopyToClipboard}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded font-normal float-right transition duration-500 ease-in-out transform hover:scale-105"
        >
          Copy Link
        </button>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
