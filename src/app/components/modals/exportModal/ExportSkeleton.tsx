import Card from "@mui/joy/Card";
import Skeleton from "@mui/joy/Skeleton";
import Grid from "@mui/material/Grid";

const cardData = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  title: `Card ${index + 1}`,
}));

export default function ExportSkeleton() {
  return (
    <div className="mx-auto size-3/4 mb-5">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" className="flex flex-row items-end">
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={48} height={48} />
          </Card>
        </Grid>
        {cardData.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4} lg={3}>
            <Card variant="outlined" sx={{ width: "100%", height: "80%" }}>
              <Skeleton variant="text" />
              <Skeleton variant="rectangular" sx={{ height: 40 }} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
