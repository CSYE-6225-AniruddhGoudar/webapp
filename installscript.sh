#!/bin/bash

# Update system
sudo yum update -y

# Install node.js
sudo yum install -y gcc-c++ make
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs

echo -e "\n INSTALLED NODEJS\n"

# Check Node.js version
node -v

# Install postgres
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql.service
sudo systemctl enable postgresql.service
echo -e "\nINSTALLED POSTGRES\n"

# Setup password for postgresql
echo "Setting password for postgres user"
echo "Pablo@18" | sudo passwd --stdin postgres
sudo -u postgres psql -c "CREATE DATABASE anirudhgoudar;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'password';"
sudo -u postgres psql -d anirudhgoudar -c "ALTER USER postgres WITH PASSWORD 'password';"
#sudo -u postgres psql -c "CREATE USER web_user WITH PASSWORD 'bindu@18';"
#sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE web_db TO web_user;"
echo -e "\nCREATED USER & DATABASE\n"

sudo sed -i.bak 's/ident/md5/g' /var/lib/pgsql/data/pg_hba.conf
sudo systemctl restart postgresql.service