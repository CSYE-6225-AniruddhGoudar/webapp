#!/bin/bash
# Install node modules for webapp application
cd /opt/csye6225/webapp || exit
sudo npm install

# Copy systemd file
sudo cp /tmp/webapp.service /etc/systemd/system/

#  permission changes to group(csye6225) and user
sudo chown csye6225:csye6225 /etc/systemd/system/webapp.service
sudo chmod 750 /etc/systemd/system/webapp.service
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 750 /opt/csye6225/webapp


sudo systemctl daemon-reload

sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp

# audit logs
sudo yum install -y rsyslog
sudo systemctl daemon-reload