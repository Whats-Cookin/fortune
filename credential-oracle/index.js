const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3007;

app.use(bodyParser.json());
app.use(cors());

app.post("/auth/github", async function (req, res) {
  try {
    const { githubAuthCode } = req.body;

    if (!githubAuthCode) {
      return res
        .status(400)
        .json({ message: "githubAuthCode is not specified or empty" });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const accessTokenUrl = process.env.GITHUB_ACCESS_TOKEN_URL;
    const { data: tokens } = await axios.post(
      accessTokenUrl,
      {},
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code: githubAuthCode,
        },
        headers: { Accept: "application/json" },
      }
    );

    const { access_token } = tokens;

    const githubUserInfoUrl = "https://api.github.com/user";
    const { data: userData } = await axios.get(githubUserInfoUrl, {
      headers: { Authorization: `token ${access_token}` },
    });

    /**
     * To do:
     *  1. Web scrape the achivements from Github
     *  2. Write the data to composedb
     */

    res.status(200).json({ message: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Reputation Oracle server listening the port ${port}`);
});
