# Terraform EKS for backer-upper

This directory contains the configuration needed to launch an Elastic Kubernetes Service
that will provide a highly available `backer-upper` service. Unfortunately this cannot be
used currently, as it requires using `t3.large` instance type for the nodes and these are
not free-tier applicable.

# Usage Instructions

> Assumes terraform, kubectl, and aws CLI are installed

1. `terraform plan -out tfPlan`
2. `terraform apply tfPlan`
3. `aws eks update-kubeconfig --region us-west-1 --name backer-upper`
4. Create the secrets for AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and POSTGRES_URL via
   the following command: `kubectl create secret generic {secret-name} --from-literal={secret-key}={secret-value}`.
   Note that secret-name must be unique
5. Start the deployment with `kubectl apply -f deployment.yml`
6. Remove all deployments: `kubectl delete deployments --all`
