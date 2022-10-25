import cors from "cors";
import axios from "axios";
import express from "express";
import { getGithubUserAchievements } from "@whatscookin/github_user_badge_scraper";

import { compose } from "./compose.js";
import {
  removeNullAndUndefined,
  getRelevantGithubUserFieldsForComposeDB,
  achievementsAsArray,
} from "./utils.js";
import { CREATE_GITHUB_USER } from "./queries.js";

const app = express();
const port = process.env.PORT || 3007;

app.use(express.json());
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

    const { data: githubUserData } = await axios.get(
      "https://api.github.com/user",
      {
        headers: { Authorization: `token ${access_token}` },
      }
    );

    const relevantUserData =
      getRelevantGithubUserFieldsForComposeDB(githubUserData);

    const { html_url } = relevantUserData;
    const achievements = await getGithubUserAchievements(html_url);
    const achievementsArray = achievementsAsArray(achievements);

    let variables = { ...relevantUserData, achievement: achievementsArray };
    variables = removeNullAndUndefined(variables);

    const composeRes = await compose.executeQuery(
      CREATE_GITHUB_USER,
      variables
    );

    if (composeRes.errors) {
      res.status(500).json({ message: composeRes.errors[0].message });
    }

    res.status(201).json({ message: githubUserData, composedb: composeRes });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Reputation Oracle server listening the port ${port}`);
});
