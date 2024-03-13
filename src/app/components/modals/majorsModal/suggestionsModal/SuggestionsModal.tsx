//import { DefaultPlannerContext } from "@/app/contexts/DefaultPlannerProvider";
import useMajorRequirementLists from "@/app/hooks/useMajorRequirementLists";
import { Major } from "@/app/types/Major";
import {
  //Binder,
  RequirementList,
} from "@/app/types/Requirements";
//import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { ModalsContext } from "@contexts/ModalsProvider";
//import { PermissionsContext } from "@contexts/PermissionsProvider";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button, //Card, //Chip,
  IconButton,
  Modal,
  ModalClose,
  Sheet, //Tooltip,
  Typography,
} from "@mui/joy";
//import { CircularProgress } from "@mui/material";
//mport ThumbDownIcon from '@mui/icons-material/ThumbDown';
//import { hasPermissionToEditMajor } from "@/lib/permissionsUtils";
import { useSession } from "next-auth/react";
import { useContext } from "react";

import { Requirements } from "../Requirements";

export default function SuggestionsModal() {
  const {
    setShowSuggestionsModal: setShowModal,
    showSuggestionsModal: showModal,
    //setShowReplaceRLModal,
    setMajorToEdit,
    setUserToEdit,
    setShowMajorRequirementsEditModal,
    majorToSuggest: major,
  } = useContext(ModalsContext);

  // useContext(ModalsContext);
  // const { getLoadingSave, onSaveMajorRequirements } = useContext(
  //   MajorVerificationContext,
  // );
  //const { majorsAllowedToEdit } = useContext(PermissionsContext);
  const { data: session } = useSession();
  const {
    majorRequirementLists,
    // onAddMajorRequirementList,
    // onGetApprovedMajorRequirement,
    // onGetMajorRequirementList,
    // onRemoveMajorRequirementList,
    // onGetUpvotes,
    onAddUpvote,
    // onRemoveUpvote,
  } = useMajorRequirementLists(major?.id);

  // const approvedMajorRequirements =
  //   major !== undefined ? onGetApprovedMajorRequirement(major.id) : undefined;

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <Typography level="h4">
            {major?.name} {major?.catalogYear} Requirements
          </Typography>
        </div>
      </div>
    );
  }

  // function handleToggleEditButton() {
  //   setEditing(!editing);
  //   if (editing) {
  //     onSaveMajorRequirements(major.id);
  //   }
  // }

  function handleClickEditRequirements(major: Major) {
    setMajorToEdit(major);
    setUserToEdit(session?.user.id);
    setShowMajorRequirementsEditModal(true);
  }

  return (
    <Modal
      open={showModal}
      onClose={() => {
        // if (editing) {
        //   handleToggleEditButton();
        // }
        setShowModal(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        sx={{
          width: "60%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        {major !== undefined && (
          <>
            <div>
              <div className="mb-4">
                <Title />
              </div>

              <div className="flex flex-row mb-3">
                <div
                  className="overflow-y-scroll w-full"
                  style={{ maxHeight: "80vh" }}
                >
                  {majorRequirementLists &&
                    majorRequirementLists.map(
                      ([majorRequirement, userId]: [
                        RequirementList,
                        string,
                      ]) => (
                        <div key={majorRequirement.id}>
                          <Accordion
                            key={majorRequirement.id}
                            variant="soft"
                            sx={{
                              borderRadius: "0.5rem",
                              "&.MuiAccordion-root": {
                                "& .MuiAccordionSummary-root": {
                                  padding: "0.5rem 0",
                                  paddingX: "0.5rem",
                                },
                              },
                            }}
                            //defaultExpanded={}
                          >
                            <AccordionSummary>
                              <Typography>
                                {userId}&apos;s suggestion
                              </Typography>
                              <div>
                                <IconButton
                                  onClick={() => onAddUpvote(userId, major.id)}
                                >
                                  <ThumbUpIcon />
                                </IconButton>
                                0
                                {/* <IconButton onClick={() => onRemoveUpvote(220)}>
                                <ThumbDownIcon />
                              </IconButton> */}
                              </div>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Requirements
                                major={major}
                                requirements={majorRequirement}
                                parents={0}
                                hideTitle={false}
                              />
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      ),
                    )}
                </div>
              </div>
              {/* <EditButtons
              editing={editing}
              loadingSave={getLoadingSave(major.id)}
              hasPermissionToEdit={true}
              handleToggleEditButton={handleToggleEditButton}
              handleClickReplaceButton={() => setShowReplaceRLModal(true)}
            /> */}
              <div className="flex flex-row justify-end">
                <Button onClick={() => handleClickEditRequirements(major)}>
                  Contribute
                </Button>
              </div>
            </div>
          </>
        )}
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}

// this component decides which RequirementsComponent to render based on the editing prop
// will also display if there are no requirements
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MajorRequirements({
  //majorRequirements,
  editing,
}: {
  majorRequirements: any;
  editing: boolean;
}) {
  return (
    <div className="overflow-y-scroll w-full" style={{ maxHeight: "80vh" }}>
      {editing ? (
        // <RequirementsEditing requirements={majorRequirements} parents={0} />
        <Button>this shit doenst work yet</Button>
      ) : (
        <Button>This shit also doenst work</Button>
        // <Requirements
        //   requirements={majorRequirements}
        //   parents={0}
        //   hideTitle={false}
        // />
      )}
    </div>
  );
}

// function EditButtons({
//   editing,
//   loadingSave,
//   hasPermissionToEdit,
//   handleToggleEditButton,
//   handleClickReplaceButton,
// }: {
//   editing: boolean;
//   loadingSave: boolean;
//   hasPermissionToEdit: boolean;
//   handleToggleEditButton: () => void;
//   handleClickReplaceButton: () => void;
// }) {
//   if (!hasPermissionToEdit) {
//     return null;
//   }

//   return (
//     <div className="flex flex-row justify-end">
//       {loadingSave ? (
//         <CircularProgress />
//       ) : (
//         <div className="space-x-2">
//           {editing && (
//             <Tooltip title="Replace with a Requirement List from a different program">
//               <Button color="warning" onClick={handleClickReplaceButton}>
//                 Replace
//               </Button>
//             </Tooltip>
//           )}
//           <Button onClick={handleToggleEditButton}>
//             {editing ? "Done" : "Contribute"}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
