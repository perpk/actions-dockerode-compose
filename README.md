# actions-dockerode-compose 🐳

PoC for running integration tests against a containerized 3rd party service by using [dockerode](https://github.com/apocas/dockerode) for container management.

The PoC's keypoints are:
1. Pull an image from a private registry; thus it's necessary to have authentication in place.
2. Run a specific bunch of tests; have a separate suite of tests to test integration.
3. Perform the container management programmatically within the code, not via workflow script, actions, etc.
