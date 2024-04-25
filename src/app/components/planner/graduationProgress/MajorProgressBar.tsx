import { useUserPrograms } from "@hooks/reactQuery";
import { Box, Typography, useTheme } from "@mui/joy";
import { Popper } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function MajorProgressBar({
  percentages,
}: {
  percentages: { [key: string]: number };
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const averagePercentage = percentages["average"] || 0;
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: userPrograms } = useUserPrograms(userId);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "flex", alignItems: "center", position: "relative" }}
    >
      <div
        className="flex flex-row w-full h-6 rounded-md bg-blue-50 dark:bg-bg-faded-dark"
        style={{ cursor: "pointer" }}
      >
        <div
          className="rounded-md bg-blue-200 dark:bg-blue-600"
          style={{
            width: `${averagePercentage}%`,
            transition: "width 0.25s",
          }}
        ></div>
      </div>
      {Object.keys(percentages).length > 0 && (
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom"
          modifiers={[
            {
              name: "flip",
              enabled: true,
              options: {
                altBoundary: true,
                rootBoundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                tether: true,
                rootBoundary: "viewport",
                strategy: "fixed",
                padding: 8,
              },
            },
          ]}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 8,
              marginTop: "0.5rem",
              backgroundColor:
                theme.palette.mode === "dark" ? "#181a1c" : "#eef3f8",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            {Object.keys(percentages).map((key, index, array) => {
              if (key !== "average") {
                const majorName =
                  userPrograms?.find(
                    (program) => program.id === parseInt(key, 10),
                  )?.name || "Unknown";
                const programType =
                  userPrograms?.find(
                    (program) => program.id === parseInt(key, 10),
                  )?.programType || "Major";
                return (
                  <div
                    key={key}
                    style={{
                      marginBottom:
                        index === array.length - 2 ? "0.2rem" : "0.8rem",
                    }}
                  >
                    <Typography sx={{ fontWeight: "lg", fontSize: 11 }}>
                      {`${
                        majorName.length > 25
                          ? majorName.substring(0, 25) + "..."
                          : majorName
                      } ${programType} - ${Math.round(percentages[key])}%`}
                    </Typography>
                    <div
                      className="flex flex-row w-full h-5 rounded-md bg-blue-100 dark:bg-bg-faded-dark"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="rounded-md bg-blue-300 dark:bg-blue-600"
                        style={{
                          height: "100%",
                          width: `${percentages[key]}%`,
                          transition: "width 0.25s",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </Box>
        </Popper>
      )}
    </div>
  );
}
