variable "key" {
  description = "The key to use for the EC2 instance"
}

variable "s3-bucket" {
  description = "The name of the S3 bucket to use for backups"
  default     = "slugpath-backups"
}

variable "postgres-url" {
  description = "The URL of the Postgres database to backup"
}