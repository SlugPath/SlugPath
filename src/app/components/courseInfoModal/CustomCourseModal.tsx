import { StoredCourse } from "@/graphql/planner/schema";
import { customCourse } from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
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

export interface CustomCourseModalProps {
  isOpen: boolean;
  onClose: (c: StoredCourse) => void;
  defaultCourse?: StoredCourse | undefined;
}

type QuartersOffered = {
  Fall: boolean;
  Winter: boolean;
  Spring: boolean;
  Summer: boolean;
};

const allQuartersOffered = {
  Fall: true,
  Winter: true,
  Spring: true,
  Summer: true,
};

export default function CustomCourseModal({
  isOpen,
  onClose,
  defaultCourse,
}: CustomCourseModalProps) {
  const [course, setCustomCourse] = useState<StoredCourse>(
    defaultCourse ? { ...defaultCourse } : customCourse(),
  );

  const [quarters, setQuarters] = useState<QuartersOffered>({
    ...allQuartersOffered,
  });

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
    item: keyof QuartersOffered,
  ) => {
    setQuarters((prev) => {
      return {
        ...prev,
        [item]: e.target.checked,
      };
    });
  };

  const onSave = () => {
    // Validation
    if (course.title.length == 0) {
      setTooShortError(true);
      return;
    }

    if (course.credits < 1 || course.credits > 15) {
      setInvalidCreditsError(true);
      return;
    }

    // Get all the quarters
    const quartersOffered = Object.keys(quarters).filter(
      (q) => quarters[q as keyof QuartersOffered],
    );
    course.quartersOffered = quartersOffered;
    onClose(course);

    // Reset custom course and quarters
    setCustomCourse(customCourse());
    setQuarters({ ...allQuartersOffered });
  };

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      onKeyDown={(e) => e.key === "Enter" && onSave()}
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
              <Chip color="warning" size="lg" className="mt-2 mr-2">
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
            maxRows={4}
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
                  {["Fall", "Winter", "Spring", "Summer"].map((item) => (
                    <ListItem key={item}>
                      <Checkbox
                        overlay
                        disableIcon
                        checked={quarters[item as keyof QuartersOffered]}
                        onChange={(e) =>
                          handleQuarterChange(e, item as keyof QuartersOffered)
                        }
                        variant="soft"
                        label={item}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={onSave}>
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
