import { Button } from "@mui/joy";

export default function SaveButtons({
  saveButtonName,
  isInPlannerPage,
  onSkip,
  onClickSave,
  onClickReplaceCurrent,
  onClickCreateNew,
  majorSelectionIsValid,
}: {
  saveButtonName: string;
  isInPlannerPage?: boolean;
  onSkip?: () => void;
  onClickSave: () => void;
  onClickReplaceCurrent: () => void;
  onClickCreateNew: () => void;
  majorSelectionIsValid: boolean;
}) {
  return (
    <div>
      {onSkip && (
        <Button onClick={onSkip} variant="plain">
          Skip
        </Button>
      )}
      <div>
        <Button onClick={onClickSave}>{saveButtonName}</Button>
        {isInPlannerPage && (
          <>
            <Button
              disabled={!majorSelectionIsValid}
              color="warning"
              onClick={onClickReplaceCurrent}
            >
              Replace Current
            </Button>
            <Button
              disabled={!majorSelectionIsValid}
              onClick={onClickCreateNew}
            >
              Create New
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
