import { StoredCourse } from "@/graphql/planner/schema";
import { customCourse } from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
import { InfoOutlined, SaveOutlined } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  Modal,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { ChangeEvent, useState } from "react";

const MAX_DESCRIPTION_LENGTH = 2000;

export interface CustomCourseModalProps {
  isOpen: boolean;
  onClose: (c: StoredCourse) => void;
  defaultCourse?: StoredCourse | undefined;
}

export default function CustomCourseModal({
  isOpen,
  onClose,
  defaultCourse,
}: CustomCourseModalProps) {
  const [course, setCustomCourse] = useState<StoredCourse>(
    defaultCourse ? { ...defaultCourse } : customCourse(),
  );

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
    onClose(course);

    // Reset custom course
    console.log(`Resetting`);
    setCustomCourse(customCourse());
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
          className="mb-2"
          value={course.description}
          onChange={handleDescriptionChange}
          variant="soft"
          minRows={2}
          maxRows={4}
          endDecorator={
            <Typography level="body-xs" sx={{ ml: "auto" }}>
              {course.description.length} / {MAX_DESCRIPTION_LENGTH}{" "}
              character(s)
            </Typography>
          }
        />
        <div
          className={`flex flex-row flex-end text-center gap-4 ${
            invalidCreditsError ? "items-center" : "items-end"
          }`}
        >
          <div className="flex flex-col items-start">
            <p className="text-md justify-left">Credits</p>
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
          <Button startDecorator={<SaveOutlined />} onClick={onSave}>
            Save Custom Course
          </Button>
        </div>
      </Sheet>
    </Modal>
  );
}
