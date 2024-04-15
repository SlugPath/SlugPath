"use client";

import { CssVarsProvider, extendTheme } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { MajorVerificationProvider } from "./MajorVerificationProvider";
import { ModalsProvider } from "./ModalsProvider";
import NextAuthProvider from "./NextAuthProvider";
import { PlannersProvider } from "./PlannersProvider";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// TODO: move these styling/theming logic somewhere else i.e. app/styles
declare module "@mui/joy/Card" {
  interface CardPropsColorOverrides {
    custom: true;
    transfer: true;
  }
}

declare module "@mui/joy/Chip" {
  interface ChipPropsColorOverrides {
    custom: true;
    transfer: true;
  }
}

function customizeTheme() {
  // Colors
  const lavender = "#E6E6FA";
  const darkLavender = "#231645";

  const green = "#e8f4ea";
  const darkGreen = "#1E2F23";

  return extendTheme({
    components: {
      JoyCard: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            // Custom color
            ...(ownerState.color === "custom" && {
              invertedColors: true,
              backgroundColor: lavender, //lavender
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: darkLavender,
              },
            }),
            // Transfer color
            ...(ownerState.color === "transfer" && {
              invertedColors: true,
              backgroundColor: green,
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: darkGreen,
              },
            }),
          }),
        },
      },
      JoyChip: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...(ownerState.color === "custom" && {
              invertedColors: true,
              backgroundColor: lavender,
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: darkLavender,
              },
            }),
            ...(ownerState.color === "transfer" && {
              invertedColors: true,
              backgroundColor: green,
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: darkGreen,
              },
            }),
          }),
        },
      },
    },
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const theme = customizeTheme();
  return (
    <NextAuthProvider>
      <CssVarsProvider defaultMode="system" theme={theme}>
        <QueryClientProvider client={queryClient}>
          <MajorVerificationProvider>
            <ModalsProvider>
              <PlannersProvider>{children}</PlannersProvider>
            </ModalsProvider>
          </MajorVerificationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </CssVarsProvider>
    </NextAuthProvider>
  );
}
