import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function FulfillmentMark({
  isSatisfied,
}: {
  isSatisfied: boolean;
}) {
  return (
    <>
      {isSatisfied ? (
        <CheckCircleIcon color="success" />
      ) : (
        <ErrorIcon color="warning" />
      )}
    </>
  );
}
