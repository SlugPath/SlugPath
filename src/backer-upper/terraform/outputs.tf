output "ec2_instance_public_ssh" {
  value = "ssh -i '${var.key}.pem' ec2-user@${aws_instance.app_server.public_dns}"
}
