import { Term } from "@/app/types/Quarter";
import { initializeCustomCourse } from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
import { StoredCourse } from "@customTypes/Course";
import { InfoOutlined } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Input,
  List,
  ListItem,
  Modal,
  ModalClose,
  Sheet,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import { ChangeEvent, useState } from "react";

const MAX_DESCRIPTION_LENGTH = 2000;
const QUARTERS: Term[] = ["Fall", "Winter", "Spring", "Summer"];

const cmpQuarters = (a: string, b: string) => {
  return QUARTERS.indexOf(a as Term) - QUARTERS.indexOf(b as Term);
};
export interface CustomCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (c: StoredCourse) => void;
  defaultCourse?: StoredCourse | undefined;
}

export default function CustomCourseModal({
  isOpen,
  onSave,
  onClose,
  defaultCourse,
}: CustomCourseModalProps) {
  const [course, setCustomCourse] = useState<StoredCourse>(
    defaultCourse ? { ...defaultCourse } : initializeCustomCourse(),
  );

  const setQuarters = (newQuarter: string, offered: boolean) => {
    setCustomCourse((prev) => {
      let quartersOffered = prev.quartersOffered;
      if (offered) {
        quartersOffered = [...quartersOffered, newQuarter];
      } else {
        quartersOffered = quartersOffered.filter((q) => q != newQuarter);
      }
      // Sort them in a canonical order
      quartersOffered.sort(cmpQuarters);
      return {
        ...prev,
        quartersOffered,
      };
    });
  };

  // Errors
  const [invalidCreditsError, setInvalidCreditsError] = useState(false);
  const [tooShortError, setTooShortError] = useState(false);

  // Handlers
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTooShortError(false);
    setCustomCourse((prev) => {
      return {
        ...prev,
        title: e.target.value,
      };
    });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = truncateTitle(
      e.target.value,
      MAX_DESCRIPTION_LENGTH,
    );
    setCustomCourse((prev) => {
      return {
        ...prev,
        description: newDescription.slice(0, MAX_DESCRIPTION_LENGTH),
      };
    });
  };

  const handleCreditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvalidCreditsError(false);
    setCustomCourse((prev) => {
      return {
        ...prev,
        credits: parseInt(e.target.value) ?? 0,
      };
    });
  };

  const handleQuarterChange = (
    e: ChangeEvent<HTMLInputElement>,
    item: "Fall" | "Winter" | "Spring" | "Summer",
  ) => {
    setQuarters(item, e.target.checked);
  };

  const handleSave = () => {
    // Validation
    if (course.title.length == 0) {
      setTooShortError(true);
      return;
    }

    if (course.credits < 1 || course.credits > 15) {
      setInvalidCreditsError(true);
      return;
    }

    onSave(course);

    // Reset custom course and quarters
    setCustomCourse(initializeCustomCourse());
  };

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
        sx={{
          width: "50%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <Typography level="title-lg">Edit Custom Course</Typography>
            <Tooltip title="We recommend replacing this custom course with a real course.">
              <Chip color="custom" size="lg" className="mt-2 mr-2">
                Custom Course
              </Chip>
            </Tooltip>
          </div>
          <FormControl error={tooShortError}>
            <Input
              placeholder="Course Title"
              value={course.title}
              variant="soft"
              sx={{
                marginBottom: "1rem",
                "--Input-focusedInset": "var(--any, )",
                "--Input-focusedThickness": "0.25rem",
                "--Input-focusedHighlight": "rgba(13,110,253,.25)",
                "&::before": {
                  transition: "box-shadow .15s ease-in-out",
                },
                "&:focus-within": {
                  borderColor: "#86b7fe",
                },
              }}
              onChange={handleTitleChange}
            />
            {tooShortError && (
              <FormHelperText>
                <InfoOutlined />
                Course name cannot be empty.
              </FormHelperText>
            )}
          </FormControl>
          <Textarea
            placeholder="Description"
            className="border-0"
            value={course.description}
            onChange={handleDescriptionChange}
            variant="soft"
            minRows={2}
            maxRows={8}
            sx={{
              outline: "none",
            }}
            endDecorator={
              <Typography level="body-xs" sx={{ ml: "auto" }}>
                {course.description.length} / {MAX_DESCRIPTION_LENGTH}{" "}
                character(s)
              </Typography>
            }
          />
          <div className="flex flex-row flex-end text-center gap-4 justify-between">
            <div className="flex flex-col items-start">
              <p className="text-md justify-left mb-2">Credits</p>
              <Input
                variant="soft"
                placeholder="Credits"
                defaultValue={"5"}
                value={course.credits ? course.credits.toString() : ""}
                onChange={handleCreditChange}
              />
              {invalidCreditsError && (
                <div className="text-red-600 text-md">
                  Credits must be between 1 and 15
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-md mb-2">Quarters Offered</p>
              <div role="group" aria-labelledby="quarters">
                <List
                  orientation="horizontal"
                  wrap
                  sx={{
                    "--List-gap": "8px",
                    "--ListItem-radius": "20px",
                  }}
                >
                  {QUARTERS.map((item) => (
                    <ListItem key={item}>
                      <Checkbox
                        overlay
                        disableIcon
                        checked={
                          course.quartersOffered.findIndex((q) => q === item) !=
                          -1
                        }
                        onChange={(e) => handleQuarterChange(e, item)}
                        variant="soft"
                        label={item}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={handleSave}>
            <Typography
              level="body-lg"
              sx={{
                color: "white",
              }}
            >
              Save
            </Typography>
          </Button>
          <ModalClose />
        </div>
      </Sheet>
    </Modal>
  );
}
