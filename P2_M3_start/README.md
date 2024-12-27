# Project 2: Create a Self-Service Platform

> This project is part of a series, _Self-Service Internal Developer Platform with Terraform on AWS_. The projects in the series are:
>
> - Deploy with CDK for Terraform
> - Create a Self-Service Platform (this one)
> - User and Cost Management
> - Create a Developer Workflow

This set of starter files/directory structure is designed to help you get started.

```
% tree
.
├── README.md
├── apps
│   └── petapp
│       ├── Dockerfile
│       ├── README.md
│       ├── package-lock.json
│       ├── package.json
│       ├── src
│       │   └── index.ts
│       └── tsconfig.json
└── idp
    ├── api
    ├── infra
    │   ├── base.ts
    │   ├── cdktf.json
    │   ├── contrib
    │   │   └── PetApp
    │   │       └── index.ts
    │   ├── help
    │   ├── jest.config.js
    │   ├── main.ts
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── setup.js
    │   └── tsconfig.json
    └── web
```

The `apps/` directory contains applications that you (as a DevOps/platform engineer) need to help deploy.

The `idp/` directory is to house code that will make up the internal developer platform (IDP) we are building in this liveProject series. It contains 3 directories:

- `infra/` - this contains the CDK for Terraform (CDKTF) code (in TypeScript) completed in Project 1.
- `api/` - this would include the back-end API that abstracts away the `cdktf` and `git` calls. This automates our deployment further; now, instead of running `cdktf deploy`, we can call a set of HTTP endpoints. We will be working in this directory a lot in this liveProject.
- `web` - this includes the front-end web application that provides a web-based graphical interfaces to the API. This further abstract away our API calls into GUI elements; instead of calling API endpoints, you can now type in input boxes and press a few buttons! You won't need to build this as we will provide it for you.

## Quick Start

> If you have completed Project 1, I'd highly recommend you to continue from the code you've already written and skip the following set-up steps.

1. Sign up for a GitHub account (if you don't have one) - you can join by filling the [Create your account](https://github.com/join) form
2. Create a new GitHub Organisation - see _[Creating a new organization from scratch](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch)_ for detailed instructions
3. Create two empty Git repositories on GitHub, one for our `apps/petapp` code, and one for the `idp/infra` code - see _[Create a repo](https://docs.github.com/en/get-started/quickstart/create-a-repo)_ for detailed instructions
4. Set up your project files by cloning this repository.

    ```
    $ git clone <repo-url> manning_idp
    ```
5. Remove all the `.gitkeep` files - we have added a file called `.gitkeep` in `idp/api`, and `idp/web`. This is a common (unofficial) convention that allows us to commit otherwise empty directories in Git. The `.gitkeep` file should be removed after you first clone this repository.

    ```
    $ find . -name .gitkeep -type f -delete
    ```

6. Each of the `apps/petapp`, `idp/infra`, `idp/api`, and `idp/web` should be its own Git repository, but only `apps/petapp`, `idp/infra` needs to be hosted remotely on GitHub.
   
   Initialize the Git repositories for `apps/petapp` and `idp/infra` by running the commands below, swapping out `<petapp-remote-url>` and `<infra-remote-url>` with the repository URLs you created in step (3).

    ```
    $ cd manning_idp
    $ rm -rf .git
    $ cd apps/petapp && git init && git branch -M main && git remote add origin <petapp-remote-url> && git add -A && git commit -m "Initial commit" && git push -u origin main && cd ../..
    $ cd idp/infra && git init && git branch -M main && git remote add origin <infra-remote-url>
    ```
7. [Create a new AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)

8. [Delete the default VPC from the account](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#deleting-default-vpc)

9. Create an IAM user with an administrative role and set up a [named profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) for that user

10. Follow the _Authorizing CodeBuild to Create GitHub Webhooks_ guide to allow CodeBuild to set up GitHub webhooks automatically for you (you'll find the guide as a resource in the liveProject web UI)

11. Within `idp/infra/main.ts`, update the following configuration parameters:

   - `BaseStack`
     - `profile` - name of the AWS Named Profile
   - `PetAppStack`
     - `profile` - name of the AWS Named Profile
     - `repository` - name of the GitHub repository holding the `PetApp` application
     - `branch` - name of the GitHub branch to watch for changes

12. From within the `idp/infra` directory, run [`cdktf deploy`](https://learn.hashicorp.com/tutorials/terraform/cdktf) to deploy the infrastructure on AWS. The process may take many minutes. If is fails for whatever reason, try to run `cdktf deploy` again. The `cdktf deploy` command should be idempotent.

13. You are now ready to get started!
