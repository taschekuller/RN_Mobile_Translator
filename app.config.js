import 'dotenv/config'; 
export default ({ config }) => ({
  ...config,
  extra: {
    BASE_URL: process.env.BASE_URL || "http://192.168.3.212:8087/",
  },
});
