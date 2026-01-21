# k6-demo

k6 Operator (Helm)
     |
     v
Custom xk6 Runner (Docker)
     |
     +--> API Load Tests
     |
     +--> Kubernetes Resource Tests
             |
             +--> ConfigMaps / Pods / Deployments


K6 creates two CRDs Private Load Zones and Test Runs. 

Test Runs run in Load Zones. Load Zones can be private or public.

Test Cases are defined using a yaml and js file. the JavaScript file contains the test configuration whereas the testrun.yaml setups the runner that will execute that JavaScript test. 

The structure works as follows, after deploying k6-operator via Helm, we can define our K6 tests which will allow us to perform API performance testing on our cluster. testrun.yaml defines the TestRun CRD that runs when executing our test, it also enables us to build additional configuration like parallelism and allows us to define how much resource capacity our runner should take. 

The JavaScript test case requires also a threshold meant to represent if the test case passes or fails. In the options configuration of your JavaScript test we can define what our criteria for a passed test case means. 

For testing Kubernetes Resource Testing Limits (Not just API resource limits), we can leverage an open-source extension called xk6-kubernetes, which allows our JavaScript test to use a Kubernetes library to deploy Kubernetes resources within our test case.