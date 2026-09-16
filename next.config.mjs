/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /* Every route here is already static, so the whole site can be exported as
     plain files for a preview host. Set STATIC_EXPORT=1 to produce out/. */
  ...(process.env.STATIC_EXPORT
    ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
