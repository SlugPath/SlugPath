"use client";

import { CssVarsProvider, extendTheme } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import NextAuthProvider from "./NextAuthProvider";

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
  }
}

declare module "@mui/joy/Chip" {
  interface ChipPropsColorOverrides {
    custom: true;
  }
}

function customizeTheme() {
  // Colors
  const lavender = "#E6E6FA";
  const darkLavender = "#231645";

  return extendTheme({
    components: {
      JoyCard: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...(ownerState.color === "custom" && {
              invertedColors: true,
              backgroundColor: lavender, //lavender
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: darkLavender,
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
              backgroundColor: lavender, //lavender
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: darkLavender,
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
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </CssVarsProvider>
    </NextAuthProvider>
  );
}
