# Usage Instructions (assumes terraform is installed)
1. `terraform validate`
2. `terraform apply` if validation succeeds
3. `ssh -i "fercevik@aws.pem" {ec2_instance_public_ssh}`. Ensure that the key is in the current directory
4. `crontab -l` to view crontabs
5. Verify the `~/backup` directory is created. If not create it
6. Input "0 19 * * * /bin/sh /backup-task.sh" after opening the crontab with `crontab -e` 
