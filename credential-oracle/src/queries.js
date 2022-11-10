export const CREATE_GITHUB_USER = `
    mutation (
        $user_account: String!
        $login: String!
        $github_id: Int!
        $url: String!
        $type: String!
        $site_admin: Boolean
        $name: String
        $company: String
        $blog: String
        $location: String
        $email: String
        $hireable: Boolean
        $bio: String
        $twitter_username: String
        $public_repos: Int
        $public_gists: Int
        $followers: Int
        $following: Int
        $created_at: String!
        $achievements: [GithubUserGithubAchievementInput]
    ) {
    createGithubUser(
        input: {
            content: {
                user_account: $user_account
                login: $login
                github_id: $github_id
                company: $company
                url: $url
                type: $type
                site_admin: $site_admin
                name: $name
                blog: $blog
                location: $location
                email: $email
                hireable: $hireable
                bio: $bio
                twitter_username: $twitter_username
                public_repos: $public_repos
                public_gists: $public_gists
                followers: $followers
                following: $following
                created_at: $created_at
                achievements: $achievements
            }
        }
        ){
            document {
                id
                user_account
                login
                github_id
                company
                url
                type
                site_admin
                name
                blog
                location
                email
                hireable
                bio
                twitter_username
                public_repos
                public_gists
                followers
                following
                created_at
                achievements {
                    name
                    x_val                    
                }
            }
        }
    }
    `;
