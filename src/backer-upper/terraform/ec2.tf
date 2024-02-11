resource "aws_security_group" "app_server_sg" {
  name        = "ssh-sg"
  description = "Security group for EC2 instance"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Add additional ingress or egress rules as needed
}

resource "aws_instance" "app_server" {
  ami           = "ami-02d3fd86e6a2f5122"
  instance_type = "t2.micro"

  security_groups      = [aws_security_group.app_server_sg.name]
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name

  key_name = var.key

  tags = {
    Name = "Backer-Upper"
  }

  user_data = <<-EOF
    #!/bin/bash
    sudo dnf update -y
    sudo dnf install postgresql15 cronie -y
    sudo systemctl enable crond.service
    sudo systemctl start crond.service
    sudo mkdir -p ~/backup
    cat <<EOF_CAT > backup-task.sh
    #!/bin/bash
    pg_dump "${var.postgres-url}" > ~/backup/\$(date +\%y\%m\%d\%H)_backup.sql
    aws s3 cp ~/backup/\$(date +\%y\%m\%d\%H)_backup.sql s3://${var.s3-bucket}/
    EOF_CAT
    sudo chmod 775 backup-task.sh
  EOF
}

