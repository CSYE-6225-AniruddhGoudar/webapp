#!/bin/bash
# Install unzip
sudo yum install -y unzip

# Check if the directory /opt/csye6225/ exists, if not, create it
if [ ! -d "/opt/csye6225/" ]; then
    sudo mkdir -p /opt/csye6225/
fi

# Move webapp.zip and install node modules
sudo mv /tmp/webapp.zip /opt/csye6225/
cd /opt/csye6225/ || exit
sudo unzip webapp.zip
sudo rm webapp.zip

# Create new group and user if they don't exist
sudo groupadd -f csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225 -m csye6225
echo "USER CREATED SUCCESFULLY"

# Change ownership of /opt/csye6225/
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 775 /opt/csye6225/


# Create log file
sudo touch /var/log/csye6225.log
sudo chown csye6225:csye6225 /var/log/csye6225.log
sudo chmod 750 /var/log/csye6225.log