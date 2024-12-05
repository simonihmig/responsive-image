process.exitCode = process.env.BRANCH.startsWith('renovate/') ? 0 : 1;
