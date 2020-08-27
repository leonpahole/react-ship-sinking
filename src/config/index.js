let config;

if (process.env.NODE_ENV === "production") {
  config = require("./production").default;
} else {
  config = require("./development").default;
}

export default config;
