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
echo "CSYE6225 related permissions completed"
#sudo touch /var/log/webapp.log
# sudo touch /var/log/webapp.log
# sudo chown csye6225:csye6225 /var/log/webapp.log
# sudo chmod 775 /var/log/webapp.log

cd /var/log
echo "You are inside var/log"

echo "creating webapplication directory"
sudo mkdir -p webapplication
echo "Created webapplication directory"

sudo chown -R csye6225:csye6225 /var/log/webapplication
sudo chmod -R 775 /var/log/webapplication