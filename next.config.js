const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */

module.exports = withBundleAnalyzer({
  // output: "standalone",
  // async headers() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" }, // replace this with actual origin if needed
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,DELETE,PATCH,POST,PUT",
  //         },
  //         // {
  //         //   key: "Access-Control-Allow-Headers",
  //         //   value:
  //         //     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  //         // },
  //       ],
  //     },
  //   ];
  // },
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        "globalThis.__DEV__": false,
      }),
    );
    return config;
  },
});
