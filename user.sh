#!/bin/bash
# Install unzip package
sudo yum install -y unzip

# create /opt/csye6225/ if doesnt exist
if [ ! -d "/opt/csye6225/" ]; then
    sudo mkdir -p /opt/csye6225/
fi

# Move webapp.zip and extract its contents
sudo mv /tmp/webapp.zip /opt/csye6225/
cd /opt/csye6225/ || exit
sudo unzip webapp.zip
sudo rm webapp.zip

# Create new group csye6225 and nologin user
sudo groupadd -f csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225 -m csye6225
echo "USER CREATED SUCCESFULLY"

# Change ownership and permissions of /opt/csye6225/
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 775 /opt/csye6225/


# Create log file for csye6225 service

if [ ! -d "/var/log/webappApplication" ]; then
    sudo mkdir -p /var/log/webappApplication
fi

#sudo touch /var/log/webappApplication/webapp.log
sudo chown csye6225:csye6225 /var/log/webappApplication
sudo chmod 775 /var/log/webappApplication