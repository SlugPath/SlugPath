locals {
  name   = "backer-upper"
  vpc_cidr = "10.123.0.0/16"
  azs      = ["us-west-1b", "us-west-1c"]

  public_subnets  = ["10.123.1.0/24", "10.123.2.0/24"]
  private_subnets = ["10.123.3.0/24", "10.123.4.0/24"]
  intra_subnets   = ["10.123.5.0/24", "10.123.6.0/24"]

  tags = {
    Name        = local.name
    Environment = "dev"
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 4.0.0"

  name = local.name
  cidr = local.vpc_cidr

  azs                = local.azs
  private_subnets    = local.private_subnets
  public_subnets     = local.public_subnets
  intra_subnets      = local.intra_subnets

  enable_nat_gateway = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
}

