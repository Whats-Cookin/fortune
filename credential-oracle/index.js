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
  const { githubAuthCode, userAccount } = req.body;

  if (!githubAuthCode || !userAccount) {
    return res.status(400).json({
      message: "githubAuthCode and userAccount are required fields",
    });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const accessTokenUrl = process.env.GITHUB_ACCESS_TOKEN_URL;

  try {
    const { data } = await axios.post(
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
    if (data.error) {
      return res.status(400).json({ message: data.error });
    }

    const { access_token } = data;

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

    let variables = {
      ...relevantUserData,
      achievements: achievementsArray,
      user_account: userAccount,
    };
    variables = removeNullAndUndefined(variables);

    const composeDBResult = await compose.executeQuery(
      CREATE_GITHUB_USER,
      variables
    );

    if (composeDBResult.errors) {
      return res
        .status(500)
        .json({ message: composeDBResult.errors[0].message });
    }

    res
      .status(201)
      .json({ message: composeDBResult.data.createGithubUser.document });
  } catch (err) {
    let statusCode = err.response?.status || 500;
    let message = err.response?.data?.message || err.message;

    res.status(statusCode).json({ message });
  }
});

app.listen(port, () => {
  console.log(`Reputation Oracle server listening the port ${port}`);
});
